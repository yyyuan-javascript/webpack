const {
    createIndexMap,
    getKey,
} = require('./indexMap');
/**
 * 创建chunkSetsInGraph
 * @param {Array} modules 参与打包的模块
 */
const createChunkSetsInGraph = (indexMap, modules = []) => {
    const chunkSetsInGraph = new Map();
    modules.forEach(({ chunksIterable } = {}) => {
        const chunksKey = getKey(indexMap, chunksIterable);
        chunkSetsInGraph.set(chunksKey, new Set(chunksIterable));
    });
    return chunkSetsInGraph;
};

module.exports = {
    createChunkSetsInGraph
};