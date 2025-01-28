class NeuralNetwork {
    constructor(m1, m2, m3, m4, x, y) {
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.m4 = m4;
        this.x = x;
        this.y = y;
        this.matrix = [
            [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
            [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
            [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
            [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
        ];
        this.bais = [this.random(), this.random(), this.random(), this.random()];
        this.ponderes = [];
        this.matrixSortie = [
          [this.random(), this.random(), this.random(), this.random()],
          [this.random(), this.random(), this.random(), this.random()],
          [this.random(), this.random(), this.random(), this.random()],
        ];
        this.result = [];
    }

    random() {
        return Math.random() * 2 - 1;
    }
    
    calcPondere(ponderes) {
        for (let i = 0; i < this.matrix.length; i++) {
            let pondere = this.matrix[i][0] * this.m1 + this.matrix[i][1] * this.m2 + this.matrix[i][2] * this.m3 + this.matrix[i][3] * this.m4 + this.matrix[i][4] * this.x + this.matrix[i][5] * this.y + this.bais[i];
            ponderes.push(pondere);
        }
    }

    ReLU(x) {
        return Math.max(0, x);
    }

    autopilot() {
        this.calcPondere(this.ponderes);
        let values = [];
        this.ponderes.forEach(pondere => {
            values.push(this.ReLU(pondere));
        });

        for (let i = 0; i < this.matrixSortie.length; i++) {
            let pondere = this.matrixSortie[i][0] * values[0] + this.matrixSortie[i][1] * values[1] + this.matrixSortie[i][2] * values[2] + this.matrixSortie[i][3] * values[3];
            this.result.push(this.ReLU(pondere));
        }
        return this.result.indexOf(Math.max(...this.result)) - 1;
    }

}

export { NeuralNetwork };