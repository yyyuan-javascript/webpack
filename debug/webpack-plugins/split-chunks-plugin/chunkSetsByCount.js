const createChunkSetsByCount = (chunkSetsInGraph) => {
const chunkSetsByCount = new Map();
for(let chunks of chunkSetsInGraph.values()){
    const count = chunks.size;
    let array = chunkSetsByCount.get(count);
    if(array === undefined){
        array = [];
        chunkSetsByCount.set(count,array);
    }
    array.push(chunks);
}
return chunkSetsByCount;
};
module.exports = {
    createChunkSetsByCount,
};