let topDoodle = [];

let finalValues = [];
const historyMaxValue = [];
const historyAverage = [];

function setTopDoodle(values) {
    topDoodle = values;
}

function getTopDoodle() {
    return topDoodle;
}

function setFinalValues(values) {
    finalValues = values;
}

function getFinalValues() {
    return finalValues;
}

export {
    historyMaxValue,
    historyAverage,
    setTopDoodle,
    getTopDoodle,
    setFinalValues,
    getFinalValues,
};

