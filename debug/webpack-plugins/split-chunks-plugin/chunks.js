const isOverLap = (a, b) => {
    for (let item of a) {
        if (b.has(item)) {
            return true;
        }
    }
    return false;
};

module.exports = {
    isOverLap,
};