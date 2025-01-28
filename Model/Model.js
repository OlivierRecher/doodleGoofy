import { Doodle } from "./Doodle.js";
import { Platform } from "./Platform.js";
import { Canva } from "./Canva.js";
import { Bot } from "./Bot.js";
import { NeuralNetwork } from "../Controller/NeuralNetwork.js";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Model {
  constructor() {
    this.doodle = new Doodle(75, 75, Canva.WIDTH / 2 - 37, Canva.HEIGHT - 75);
    this.bot = new Bot()
    this.platforms = [];
    this.score = 0;
    this.autopilot = false;

    this.createPlatforms();

    this.doodle.bindAddScore(this.addScore.bind(this));
    this.doodle.bindGetScore(this.getScore.bind(this));
    this.doodle.bindGameOver(this.gameOver.bind(this));
    this.doodle.bindRemovePlatform(this.removePlatform.bind(this));
  }

  createPlatforms() {
    let lastHeight = 0;
    for (let i = 1; i < 7; i += 0.25) {
      for (let j = 0; j < 10 * i; j++) {
        let rand = getRandomInt(10);
        this.platforms.push(
          new Platform(
            57,
            15,
            getRandomInt(Canva.WIDTH - 57),
            Canva.HEIGHT - (lastHeight + 30 * i),
            rand === 9 ? 2 : rand === 8 ? 1 : 0
          )
        );
        lastHeight += 30 * i;
      }
    }
  }

  getDirection() {
    return this.doodle.getDirection();
  }

  setDirection(newDirection) {
    this.doodle.setDirection(newDirection);
  }

  getNeighbors(){
    let results = {};
    const doodleCenter = this.doodle.getCenter()
    let platformsDisplayed = this.platforms.filter((p) => p.getCenter().y > 0 && p.getCenter().y < Canva.HEIGHT && p.getCenter().x > 0 && p.getCenter().x < Canva.WIDTH);
    for(let i = 0; i < platformsDisplayed.length; i++){
      const platform = platformsDisplayed[i];
      const platformCenter = platform.getCenter()
      const distance = Math.sqrt(Math.pow(platformCenter.x - doodleCenter.x, 2) + Math.pow(platformCenter.y - doodleCenter.y, 2))
      if(platformCenter.x < doodleCenter.x && platformCenter.y < doodleCenter.y){
        if((results.topLeft && results.topLeft.distance > distance) || !results.topLeft) results.topLeft = {distance : distance, position:platformCenter}
      }else if(platformCenter.x > doodleCenter.x && platformCenter.y < doodleCenter.y){
        if((results.topRight && results.topRight.distance > distance) || !results.topRight) results.topRight = {distance : distance, position:platformCenter}
      }else if(platformCenter.x < doodleCenter.x && platformCenter.y > doodleCenter.y){
        if((results.bottomLeft && results.bottomLeft.distance > distance) || !results.bottomLeft) results.bottomLeft = {distance : distance, position:platformCenter}
      }else if(platformCenter.x > doodleCenter.x && platformCenter.y > doodleCenter.y){
        if((results.bottomRight && results.bottomRight.distance > distance) || !results.bottomRight) results.bottomRight = {distance : distance, position:platformCenter}
      }
    }

    if(!results.topLeft) results.topLeft = {distance : -1, position:{x:-1, y:-1}}
    if(!results.topRight) results.topRight = {distance : -1, position:{x:-1, y:-1}}
    if(!results.bottomLeft) results.bottomLeft = {distance : -1, position:{x:-1, y:-1}}
    if(!results.bottomRight) results.bottomRight = {distance : -1, position:{x:-1, y:-1}}
    
    return Object.keys(results).map(r => results[r])
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
    this.doodle.setPosition(Canva.WIDTH / 2 - 37, Canva.HEIGHT - 75);
    this.score = 0;
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
        platform.move(this.display);
      }
    }

    if (this.isAutopilot()) {
      let neighbors = this.getNeighbors();
      const bot = new NeuralNetwork(
        neighbors[0].distance / Canva.WIDTH,
        neighbors[1].distance / Canva.WIDTH,
        neighbors[2].distance / Canva.WIDTH,
        neighbors[3].distance / Canva.WIDTH,
        this.doodle.position.x,
        this.doodle.position.y,
      );
      await bot.loadData();
      let direction = bot.autopilot();
      this.setDirection(direction);
    }

    if(this.scoreDisplay) this.scoreDisplay(this.score);
  }
}

export { Model };
