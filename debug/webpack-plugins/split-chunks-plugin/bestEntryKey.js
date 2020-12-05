const compairEntries = (best, cur) => {
    // 1. by priority 
    const diffPriority = best.cacheGroup.priority - cur.cacheGroup.priority;
    if (diffPriority) return diffPriority;

};
const getBestEntry = (chunksInfoMap) => {
    let bestEntryKey, bestEntry;
    for (let [key, info] of chunksInfoMap) {
        if (!bestEntryKey) {
            bestEntryKey = key;
            bestEntry = info;
        } else if (compairEntries(bestEntry, info) < 0) {
            bestEntryKey = key;
            bestEntry = info;
        }
    }
    return {
        bestEntry,
        bestEntryKey,
    };
};
module.exports = {
    getBestEntry,
};