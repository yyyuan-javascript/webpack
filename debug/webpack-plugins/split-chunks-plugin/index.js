const { 
  createIndexMap,
  getKey,
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
                const chunksInfoMap = createChunksInfoMap(modules, indexMap, chunkSetsByCount);
            });
  
  
            // console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);
    
            // Manipulate the build using the plugin API provided by webpack
            // compilation.addModule(/* ... */);
  
          }
        );
      }
    }
  module.exports = SplitChunksPlugin;
    