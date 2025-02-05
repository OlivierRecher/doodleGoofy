import { Model } from "../Model/Model.js";
import { View } from "../View/View.js";

class Controller {
  constructor(_assets, data = null, canvaId = "my_canvas", ai = false) {
    this.model = new Model(data, ai);
    this.view = new View(_assets, canvaId);

    this.startTime = Date.now();
    this.lag = 0;
    this.fps = 60;
    this.frameDuration = 1000 / this.fps;
    this.autopilot = ai;
    this.result = {};

    this.lastScore = this.model.getScore();
    this.lastScoreChangeTime = Date.now();

    this.model.bindDisplay(this.display.bind(this));
    this.model.bindPlatformDisplay(this.platformDisplay.bind(this));
    this.model.bindScoreDisplay(this.scoreDisplay.bind(this));
    this.view.bindSetDirection(this.setDirection.bind(this));
    this.view.bindGetDirection(this.getDirection.bind(this));
    this.view.bindGetNeighbors(this.getNieghbors.bind(this));
    this.toggleAutopilot(this.autopilot);
  }

  display = (position) => {
    this.view.Display(position);
  };

  platformDisplay = (type, position) => {
    this.view.platformDisplay(type, position);
  };

  scoreDisplay = (_score) => {
    this.view.scoreDisplay(_score);
    if (_score !== this.lastScore) {
      this.lastScore = _score;
      this.lastScoreChangeTime = Date.now();
    }
  };

  setDirection(newDirection) {
    this.model.setDirection(newDirection);
  }

  getDirection() {
    return this.model.getDirection();
  }

  toggleAutopilot(toggle) {
    this.model.toggleAutopilot(toggle);
    this.view.toggleAutopilot(toggle);
  }

  isAutopilot() {
    return this.model.isAutopilot();
  }

  isGameOver() {
    return this.model.isGameOver;
  }

  getNieghbors() {
    return this.model.getNeighbors();
  }

  getResult() {
    return this.result;
  }

  setGameOver() {
    this.model.setGameOver(true);
  }

  update() {
    return new Promise((resolve) => {
      const gameLoop = () => {
        if (this.isGameOver()) {
          this.result = {
            score: this.model.getScore(),
            matrix1: this.model.matrix1,
            matrix2: this.model.matrix2,
            bais: this.model.bais,
          };
          resolve(this.result); // Resolve the promise with the result
          return; // Stop the loop
        }

        /* Calculate deltaTime */
        let currentTime = Date.now();
        let deltaTime = currentTime - this.startTime;

        this.lag += deltaTime;
        this.startTime = currentTime;

        /* Update logic if lag is sufficient */
        while (this.lag >= this.frameDuration) {
          this.model.update(this.fps);
          this.lag -= this.frameDuration;
        }

        /* Check if score hasn't changed for 20 seconds */
        if (
          currentTime - this.lastScoreChangeTime >= 20000 &&
          this.isAutopilot()
        ) {
          this.model.gameOver();
        }

        requestAnimationFrame(gameLoop); // Continue the loop
      };

      // Start the loop
      this.startTime = Date.now();
      gameLoop();
    });
  }
}

export { Controller };