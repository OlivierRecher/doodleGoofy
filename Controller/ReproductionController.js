import {
  historyMaxValue,
  historyAverage,
  setTopDoodle,
  getTopDoodle,
  setFinalValues,
  getFinalValues,
} from "../Model/data.js";

function reproduction(results) {
  setTopDoodle(results.slice(0, 25));
  setFinalValues(getTopDoodle());
  historyMaxValue.push(getTopDoodle()[0].score);
  historyAverage.push(
    getTopDoodle().reduce((acc, doodle) => acc + doodle.score, 0) /
      getTopDoodle().length
  );
  for (let i = 0; i < 50; i++) {
    const parent1 =
      getTopDoodle()[Math.floor(Math.random() * getTopDoodle().length)];
    const parent2 =
      getTopDoodle()[Math.floor(Math.random() * getTopDoodle().length)];
    const newMatrix = {
      matrix1: averageMatrices(parent1.matrix1, parent2.matrix1),
      matrix2: averageMatrices(parent1.matrix2, parent2.matrix2),
      bais: averageArray(parent1.bais, parent2.bais),
    };
    getFinalValues().push(newMatrix);
  }

  function averageMatrices(matrix1, matrix2) {
    return matrix1.map((row, rowIndex) =>
      row.map(
        (value, colIndex) => mutate(value + matrix2[rowIndex][colIndex]) / 2
      )
    );
  }

  function averageArray(array1, array2) {
    return array1.map((value, index) => mutate(value + array2[index]) / 2);
  }
}

function mutate(value) {
  const delta = Math.random() * 0.1 - 0.05;
  const newValue = value + delta;
  return Math.max(-1, Math.min(1, newValue));
}

export { reproduction };
