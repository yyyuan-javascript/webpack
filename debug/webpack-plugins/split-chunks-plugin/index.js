const { 
  createIndexMap,
  // getKey,
 } = require('./indexMap');
const {
  createChunkSetsInGraph
} = require('./chunkSetsInGraph');
const {
  createChunkSetsByCount,
} = require('./chunkSetsByCount');
const {
  createChunksInfoMap,
} = require('./chunksInfoMap');
const {
  getBestEntry,
} = require('./bestEntryKey');
const {
  isOverLap,
} = require('./chunks');
const GraphHelpers = require("../../../lib/GraphHelpers");
/** @typedef {import("../../../lib/Compiler")} Compiler */
/** @typedef {import("../../../lib/Chunk")} Chunk */
/** @typedef {import("../../../lib/Module")} Module */
/** @typedef {import("../../../lib/util/deterministicGrouping").Options<Module>} DeterministicGroupingOptionsForModule */
/** @typedef {import("../../../lib/util/deterministicGrouping").GroupedItems<Module>} DeterministicGroupingGroupedItemsForModule */
// A JavaScript class.
class SplitChunksPlugin {
    constructor(options={}){
      this.options = options;
    }
      // Define `apply` as its prototype method which is supplied with compiler as its argument
      apply(compiler) {
  /**
           * thisCompilation
           * SyncHook
              初始化 compilation 时调用，在触发 compilation 事件之前调用。
              回调参数：compilation, compilationParams
           */
      compiler.hooks.thisCompilation.tap(
          'SplitChunksPlugin',
          (compilation) => {// 通过第一个钩子获取compilation
            console.log('compiler.hooks.thisCompilation.tap!');
            let alreadyOptimized = false;
            /**
               * unseal 
               * SyncHook
                 compilation 对象开始接收新模块时触发
              */
            compilation.hooks.unseal.tap("SplitChunksPlugin", () => {
              console.log('compilation.hooks.unseal.tap');
              alreadyOptimized = false;// 为啥需要再次重置？需要看下哪些情况触发接受新模块
            });
                /**
               * optimizeChunks
               * SyncBailHook
                 在 chunk 优化阶段开始时调用。插件可以 tap 此钩子对 chunk 执行优化。
                 回调参数：chunks
               */
            compilation.hooks.optimizeChunksAdvanced.tap("SplitChunksPlugin", (chunks) => {
                console.log('compilation.hooks.optimizeChunksAdvanced.tap');
                const modules = compilation.modules;
                // step 1： 给chunk编号
                /** @type {Map<Chunk, number>} */
                const indexMap = createIndexMap(chunks);
                // console.log(indexMap);
                // step 2: 创建chunkSetsInGraph。因为只有依赖相同的module才需要提取公共代码，从module的维度，列出所有依赖了相同module的chunks的组合，
                const chunkSetsInGraph = createChunkSetsInGraph(indexMap, modules);
                // console.log(chunkSetsInGraph);

                // step 3: 将chunks按照size分组，创建
                const chunkSetsByCount = createChunkSetsByCount(chunkSetsInGraph);
                // console.log(chunkSetsByCount);

                // step 4: 创建chunks子集
                const chunksInfoMap = createChunksInfoMap({
                  options:this.options,
                  modules,
                  indexMap,
                  chunkSetsInGraph,
                  chunkSetsByCount,
                });

                // step 5: 寻找BestEntryKey, 生成bundles
                while(chunksInfoMap.size > 0){
                  const {bestEntryKey, bestEntry} = getBestEntry(chunksInfoMap);
                  console.log('bestEntryKey: ',bestEntryKey,'=>',JSON.stringify([...bestEntry.modules].map(item=>item.rawRequest)));
                  let chunkName = bestEntry.name;
                  let newChunk;
                  chunksInfoMap.delete(bestEntryKey);

                  const usedChunks = bestEntry.chunks;
                  if(usedChunks.size === 0){continue;}
                  // 向complication 添加新的chunk
                  newChunk = compilation.addChunk(chunkName);
                  for(let chunk of usedChunks){
                    // Add graph connections for splitted chunk
                    chunk.split(newChunk);
                  }
                  // Add a note to the chunk
                  // newChunk.chunkReason = `split chunk (cache group: ${bestEntry.cacheGroup.key}) (name: ${chunkName})`;

                  for(let module of bestEntry.modules){
                    // 将bestEntry中的module关联到newChunk
                    GraphHelpers.connectChunkAndModule(newChunk, module);
                    // 将bestEntry 中的module从原来的entrychunk中移除
                    for(let chunk of usedChunks){
                      chunk.removeModule(module);
                      module.rewriteChunkInReasons(chunk, [newChunk]);
                    }
                  }
                  // 遍历chunksInfoMap 删除已经打包到newChunk中moduels
                  for(let [key, info] of chunksInfoMap){
                    // 当chunkInfoMap中元素的chunks 和bestEntry的chunks有交集时，说明该元素中可能有文件已经被加到新的chunk中，需要从旧的chunks中剔除
                    if(isOverLap(info.chunks, usedChunks)){
                      for(let module of bestEntry.modules){
                        info.modules.delete(module);
                        info.size -= module.size();
                      }
                      if(info.modules.size === 0){
                        chunksInfoMap.delete(key);
                      }
                    }
                  }
                }// end while
            });
  
  
            // console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);
    
            // Manipulate the build using the plugin API provided by webpack
            // compilation.addModule(/* ... */);
  
          }
        );
      }
    }
  module.exports = SplitChunksPlugin;
    