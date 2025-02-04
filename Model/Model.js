import { Doodle } from "./Doodle.js";
import { Platform } from "./Platform.js";
import { Canva } from "./Canva.js";
import { Bot } from "./Bot.js";
import { NeuralNetwork } from "../Controller/NeuralNetwork.js";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Model {
  constructor(data = null) {
    this.doodle = new Doodle(75, 75, Canva.WIDTH / 2 - 37, Canva.HEIGHT - 75);
    this.bot = new Bot();
    this.platforms = [];
    this.score = 0;
    this.autopilot = false;
    this.difficulty = 1;
    this.isGameOver = false;
    
    this.matrix1 = data ? data.matrix1 : this.generatedRandomMatrix(4, 6);
    this.matrix2 = data ? data.matrix2 : this.generatedRandomMatrix(3, 4);
    this.bais = data ? data.bais : this.generatedRandomMatrix(1, 4);

    this.createPlatforms();

    this.doodle.bindAddScore(this.addScore.bind(this));
    this.doodle.bindGetScore(this.getScore.bind(this));
    this.doodle.bindGameOver(this.gameOver.bind(this));
    this.doodle.bindRemovePlatform(this.removePlatform.bind(this));
  }

  createPlatforms() {
    let lastPlatform = this.platforms[this.platforms.length-1];
    let lastHeight = lastPlatform ? lastPlatform.getY() : Canva.HEIGHT
    let minHeight = 25
    let maxHeight = -2000
    while (lastHeight > maxHeight){
      let rand = getRandomInt(11-this.difficulty);
      this.platforms.push(
        new Platform(57,15,getRandomInt(Canva.WIDTH - 57),lastHeight - (minHeight * this.difficulty),rand === 0 ? 2 : rand === 1 ? 1 : 0)
      );
      lastHeight -= minHeight * this.difficulty
      if(this.difficulty * 2000 < this.score && this.difficulty < 8) {
        this.difficulty += this.difficulty < 6 ? 0.5 : 0.25;
      }
    }
  }

  getDirection() {
    return this.doodle.getDirection();
  }

  setDirection(newDirection) {
    this.doodle.setDirection(newDirection);
  }

  setGameOver(bool) {
    this.isGameOver = bool;
  }

  getNeighbors() {
    let results = {};
    const doodleCenter = this.doodle.getCenter();
    let platformsDisplayed = this.platforms.filter(
      (p) =>
        p.getCenter().y > 0 &&
        p.getCenter().y < Canva.HEIGHT &&
        p.getCenter().x > 0 &&
        p.getCenter().x < Canva.WIDTH
    );
    for (let i = 0; i < platformsDisplayed.length; i++) {
      const platform = platformsDisplayed[i];
      const platformCenter = platform.getCenter();
      const distance = Math.sqrt(
        Math.pow(platformCenter.x - doodleCenter.x, 2) +
          Math.pow(platformCenter.y - doodleCenter.y, 2)
      );
      if (
        platformCenter.x < doodleCenter.x &&
        platformCenter.y < doodleCenter.y
      ) {
        if (
          (results.topLeft && results.topLeft.distance > distance) ||
          !results.topLeft
        )
          results.topLeft = { distance: distance, position: platformCenter };
      } else if (
        platformCenter.x > doodleCenter.x &&
        platformCenter.y < doodleCenter.y
      ) {
        if (
          (results.topRight && results.topRight.distance > distance) ||
          !results.topRight
        )
          results.topRight = { distance: distance, position: platformCenter };
      } else if (
        platformCenter.x < doodleCenter.x &&
        platformCenter.y > doodleCenter.y
      ) {
        if (
          (results.bottomLeft && results.bottomLeft.distance > distance) ||
          !results.bottomLeft
        )
          results.bottomLeft = { distance: distance, position: platformCenter };
      } else if (
        platformCenter.x > doodleCenter.x &&
        platformCenter.y > doodleCenter.y
      ) {
        if (
          (results.bottomRight && results.bottomRight.distance > distance) ||
          !results.bottomRight
        )
          results.bottomRight = {
            distance: distance,
            position: platformCenter,
          };
      }
    }

    if (!results.topLeft)
      results.topLeft = { distance: -1, position: { x: -1, y: -1 } };
    if (!results.topRight)
      results.topRight = { distance: -1, position: { x: -1, y: -1 } };
    if (!results.bottomLeft)
      results.bottomLeft = { distance: -1, position: { x: -1, y: -1 } };
    if (!results.bottomRight)
      results.bottomRight = { distance: -1, position: { x: -1, y: -1 } };

    return Object.keys(results).map((r) => results[r]);
  }

  toggleAutopilot(toggle) {
    this.autopilot = toggle;
    this.setDirection(0);
  }

  getScore() {
    return this.score;
  }

  addScore(_score) {
    this.score += _score;
  }
  
  isAutopilot() {
    return this.autopilot;
  }

  gameOver() {
    if(this.autopilot){
      this.setGameOver(true)
    }

    this.doodle.setPosition(Canva.WIDTH / 2 - 37, Canva.HEIGHT - 75);
    this.score = 0;
    this.difficulty = 1;
    this.platforms = [];
    this.createPlatforms();
  }

  bindDisplay(callback) {
    this.display = callback;
  }

  bindPlatformDisplay(callback) {
    this.platformDisplay = callback;
  }

  bindScoreDisplay(callback) {
    this.scoreDisplay = callback;
  }

  removePlatform(platform) {
    let index = this.platforms.indexOf(platform);
    this.platforms.splice(index, 1);
  }

  async update(fps) {
    this.doodle.move(fps, this.platforms, this.display);

    for (let i = 0; i < this.platforms.length; i++) {
      let platform = this.platforms[i];
      if (platform.position.y > Canva.HEIGHT + 100) {
        this.removePlatform(platform);
      }
      if (
        platform.direction === 1 &&
        platform.position.x > Canva.WIDTH - platform.width
      ) {
        platform.direction = -1;
      } else if (platform.direction === -1 && platform.position.x < 0) {
        platform.direction = 1;
      }
      platform.display(this.platformDisplay);
      if (platform.type === 1) {
        if(!this.isGameOver) platform.move(this.display);
      }
    }

    if(this.platforms.length > 0 && this.platforms[this.platforms.length-1].getY() > -175) this.createPlatforms()

    if (this.isAutopilot()) {
      let neighbors = this.getNeighbors();
      const bot = new NeuralNetwork(
        neighbors[0].distance,
        neighbors[1].distance,
        neighbors[2].distance,
        neighbors[3].distance,
        this.doodle.position.x,
        this.doodle.position.y,
        this.matrix1,
        this.matrix2,
        this.bais
      );
      let direction = bot.autopilot();
      this.setDirection(direction);
    }

    if (this.scoreDisplay) this.scoreDisplay(this.score);
  }

  generatedRandomMatrix(rows, cols) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix.push([]);
      for (let j = 0; j < cols; j++) {
        matrix[i].push(Math.random() * 2 - 1);
      }
    }
    return matrix;
  }
}

export { Model };
