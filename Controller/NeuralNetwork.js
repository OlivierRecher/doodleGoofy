class NeuralNetwork {
    constructor(m1, m2, m3, m4, x, y) {
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.m4 = m4;
        this.x = x;
        this.y = y;
        this.bais = [];
        this.matrix = [];
        this.outputMatrix = [];
        this.weights = [];
        this.result = [];
    }

    async loadData() {
        const response = await fetch("./data.json");
        const data = await response.json();
        this.bais = data.bais;
        this.matrix = data.matrix1;
        this.outputMatrix = data.matrix2;
    }

    random() {
        return Math.random() * 2 - 1;
    }

    calculateWeights(weights) {
        for (let i = 0; i < this.matrix.length; i++) {
            let weight =
                this.matrix[i][0] * this.m1 +
                this.matrix[i][1] * this.m2 +
                this.matrix[i][2] * this.m3 +
                this.matrix[i][3] * this.m4 +
                this.matrix[i][4] * this.x +
                this.matrix[i][5] * this.y +
                this.bais[i];
            weights.push(weight);
        }
    }

    ReLU(x) {
        return Math.max(0, x);
    }

    autopilot() {
        this.calculateWeights(this.weights);
        let values = this.weights.map(weight => this.ReLU(weight));

        for (let i = 0; i < this.outputMatrix.length; i++) {
            let weight =
                this.outputMatrix[i][0] * values[0] +
                this.outputMatrix[i][1] * values[1] +
                this.outputMatrix[i][2] * values[2] +
                this.outputMatrix[i][3] * values[3];
            this.result.push(this.ReLU(weight));
        }

        console.log(this.result);
        return this.result.indexOf(Math.max(...this.result)) - 1;
    }
}

export { NeuralNetwork };
