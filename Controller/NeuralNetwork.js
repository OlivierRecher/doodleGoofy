class NeuralNetwork {
    constructor(m1, m2, m3, m4, x, y, matrix1, matrix2, bais) {
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.m4 = m4;
        this.x = x;
        this.y = y;
        this.bais = bais;
        this.matrix = matrix1;
        this.outputMatrix = matrix2;
        this.weights = [];
        this.result = [];
    }

    random() {
        return Math.random() * 2 - 1;
    }

    ReLU(x) {
        return Math.max(0, x);
    }

    autopilot() {
        const weights = [];
        for (let i = 0; i < this.matrix.length; i++) {
            weights.push(
                Number(this.matrix[i][0]) * Number(this.m1) +
                Number(this.matrix[i][1]) * Number(this.m2) +
                Number(this.matrix[i][2]) * Number(this.m3) +
                Number(this.matrix[i][3]) * Number(this.m4) +
                Number(this.matrix[i][4]) * Number(this.x) +
                Number(this.matrix[i][5]) * Number(this.y) +
                Number(this.bais[i])
            );
        }
        for (let i = 0; i < this.outputMatrix.length; i++) {
            let weight =
              this.outputMatrix[i][0] * this.ReLU(weights[0]) +
              this.outputMatrix[i][1] * this.ReLU(weights[1]) +
              this.outputMatrix[i][2] * this.ReLU(weights[2]) +
              this.outputMatrix[i][3] * this.ReLU(weights[3]);
            this.result.push(this.ReLU(weight));
        }
        return this.result.indexOf(Math.max(...this.result)) - 1;
    }
}

export { NeuralNetwork };
