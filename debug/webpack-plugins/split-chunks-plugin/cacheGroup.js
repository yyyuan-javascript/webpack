const normalizeCacheGroups = (groupOption={}, key, {chunks="all"}={}) => {
    let chunksFilter;
    if(chunks==="all"){
        chunksFilter = (_) => true;
    }

return{
    chunksFilter,//
    ...groupOption,
    key,
};
}
const getCacheGroups = (options={}) => {
    const {cacheGroups={}} = options;
    let res = [];
    for(let key of Object.keys(cacheGroups)){
        let groupOption = normalizeCacheGroups(cacheGroups[key]||{},key,options,);
        res.push(groupOption);
    }
    return res;
};
module.exports = {
    getCacheGroups
};