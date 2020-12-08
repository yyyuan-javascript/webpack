const { getCacheGroups } = require('./cacheGroup');
const { getKey } = require('./indexMap');
const SortableSet = require('../../../lib/util/SortableSet');

const isSubset = (bigSet, smallSet) => {
    if(bigSet.size < smallSet.size){
        return false;
    }
    for(let set of smallSet){
     if(!bigSet.has(set)){
         return false;
     }       
    }
    return true;
};
const sortByIdentifier = (a, b) => {
	if (a.identifier() > b.identifier()) return 1;
	if (a.identifier() < b.identifier()) return -1;
	return 0;
};
const getCombs = (chunksKey,chunkSetsInGraph, chunkSetsByCount) => {   
const parentSet = chunkSetsInGraph.get(chunksKey);
const combs = [parentSet];
if(parentSet.size > 1){ // size大于1时才有子集
    for(let [count, setArray] of chunkSetsByCount){
        if(count < parentSet.size){
            setArray.forEach(item =>{
                if(isSubset(parentSet,item)){
                    combs.push(item);
                }
            });
        }
    }
}
return combs;
};
const createChunksInfoMap = ({
    options, 
    modules,
    indexMap,
    chunkSetsInGraph,
    chunkSetsByCount,
}) => {
    // create a list of possible combinations
    const combinationsCache = new Map();
    /** @type {WeakMap<Set<Chunk>, WeakMap<ChunkFilterFunction, SelectedChunksResult>>} */
    const selectedChunksCacheByChunksSet = new Map();
    /** @type {Map<string, ChunksInfoItem>} */
    const chunksInfoMap = new Map();
    for(const module of modules){
        // 4.1 获取当前module所属的cacheGroups
        const cacheGroups = getCacheGroups(options, module);
         console.log('module 和cacheGroup的map',module.rawRequest,cacheGroups.map(({key})=>key));
        // 创建comninations，获得所有可能的vendor的组合，即当前module最终可能被打包进哪些vendor中
        const chunksKey = getKey(indexMap,module.chunksIterable);
        // 4.2 生成combs
        let combs = combinationsCache.get(chunksKey);
        if(combs === undefined){
            combs = getCombs(chunksKey,chunkSetsInGraph, chunkSetsByCount);
            combinationsCache.set(chunksKey, combs);

        }

        cacheGroups.forEach((cacheGroupSource={}, cacheGroupIndex)=>{
            const cacheGroup = cacheGroupSource;// 此处需要处理默认配置
            for(const combinations of combs){
                // combinations是可能的chunks组合,这一步是将可能的chunks组合按照cacheGroup的配置分类
                // 4.3 check minChunks条件
                if(combinations.size < cacheGroup.minChunks){
                    continue;
                }
                const {
                    chunks:selectedChunks,
                key:selectedChunksKey,
            } = getSelectedChunks(combinations, selectedChunksCacheByChunksSet,cacheGroup.chunksFilter, indexMap);
            addModuleToChunksInfoMap(
                cacheGroup,
                cacheGroupIndex,
                selectedChunks,
                selectedChunksKey,
                module,
                chunksInfoMap,
            );
            }
        });
    }
    for(let [key,{modules}={}] of chunksInfoMap){
        console.log(key,'=>',[...modules].map(item=>item.rawRequest));
    }
console.log('chunksInfoMap:', chunksInfoMap);
    return chunksInfoMap;
};

function addModuleToChunksInfoMap(
    cacheGroup,
    cacheGroupIndex,
    selectedChunks,// Array
    selectedChunksKey,
    module,
    chunksInfoMap){
        if(selectedChunks.length < cacheGroup.minChunks){
            return;
        }
        const name = cacheGroup.name;
        const key = cacheGroup.key + ` name:${name}` + ` chunks: ${selectedChunksKey}`;
       let info = chunksInfoMap.get(key);
       if(info===undefined){
        info = {
            modules: new SortableSet(undefined, sortByIdentifier),
            cacheGroup,
            cacheGroupIndex,
            name,
            size: 0,
            chunks: new Set(),
            reuseableChunks: new Set(),
            chunksKeys: new Set()
        };
        chunksInfoMap.set(key,info);
       }
       //4.4 合并相同key下的module
        info.modules.add(module);
        info.size += module.size(); // 打包后模块的大小
       if(!info.chunksKeys.has(selectedChunksKey)){
        info.chunksKeys.add(selectedChunksKey);
        for(let chunk of selectedChunks){
            info.chunks.add(chunk);
        }
       }

    }
function getSelectedChunks(combinations,selectedChunksCacheByChunksSet,chunksFilter,indexMap){
    let entry = selectedChunksCacheByChunksSet.get(combinations);
    if(entry === undefined){
        entry = new WeakMap();
        selectedChunksCacheByChunksSet.set(combinations,entry);
    }
    let entry2 = entry.get(chunksFilter);
    if(entry2===undefined){
            /** @type {Chunk[]} */
            // 4.3 用chunksFilter 过滤出能够拆分代码的chunk
        let selectedChunks = [...combinations].filter(chunksFilter);
        const key = getKey(indexMap,selectedChunks);
        entry2 = {
            chunks: selectedChunks,
            key,
        };
        entry.set(entry2);
    }
    return entry2;
}

module.exports = {
    createChunksInfoMap,
};