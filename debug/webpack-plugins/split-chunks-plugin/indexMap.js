/**
 * 
 * @param {*} chunks 
 */
const createIndexMap = (chunks) => {
          const indexMap = new Map();
          let index = 1;// chunks 从 1 开始编号，可以从任意数编号咩？
          for(let chunk of chunks){
            indexMap.set(chunk, index);
            index++;
          }
          return indexMap;
};

/**
 * 
 * @param {*} indexMap 
 * @param {*} chunks 
 */
const getKey = (indexMap,chunks) => {
  return Array.from(chunks, chunk => indexMap.get(chunk)).sort().join();
};

module.exports = {
    createIndexMap,
    getKey,
};