const normalizeCacheGroups = (groupOption = {}, key, { chunks = "all" } = {}) => {
    let chunksFilter;
    if (chunks === "all") {
        chunksFilter = (_) => true;
    }

    return {
        chunksFilter,//
        ...groupOption,
        key,
    };
}
function checkTest(test, module = {}) {
    if (test) {
        return test.test(module.nameForCondition());
    }
    return true;
}
const getCacheGroups = (options = {}, module) => {
    const { cacheGroups = {} } = options;
    let res = [];
    for (let key of Object.keys(cacheGroups)) {
        const cacheGroup = cacheGroups[key];
        // 校验test规则
        if (cacheGroup && checkTest(cacheGroup.test, module)) {
            let groupOption = normalizeCacheGroups(cacheGroups[key] || {}, key, options,);
            res.push(groupOption);
        }
    }
    return res;
};
module.exports = {
    getCacheGroups
};