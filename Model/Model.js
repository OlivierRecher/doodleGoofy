import { Doodle } from "./Doodle.js";
import { Platform } from "./Platform.js";
import { Canva } from "./Canva.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Model{
    constructor(){
        this.doodle = new Doodle(75, 75, Canva.WIDTH/2 - 37, Canva.HEIGHT-75); 
        this.platforms = [];
        this.score = 0;
        
        this.createPlatforms()

        this.doodle.bindAddScore(this.addScore.bind(this));
        this.doodle.bindGetScore(this.getScore.bind(this));
        this.doodle.bindGameOver(this.gameOver.bind(this));
        this.doodle.bindRemovePlatform(this.removePlatform.bind(this));
    }

    createPlatforms(){
        let lastHeight = 0;
        for(let i = 1; i < 7; i+= 0.25){
            for(let j = 0; j < 10*i; j++){
                let rand = getRandomInt(10)
                this.platforms.push(new Platform(57, 15, getRandomInt(Canva.WIDTH-57), Canva.HEIGHT - (lastHeight + 30*i), rand===9 ? 2 : rand === 8 ? 1 : 0))
                lastHeight += 30*i
            }
        }
    }

    getDirection(){
        return this.doodle.getDirection();
    }

    setDirection(newDirection){
        this.doodle.setDirection(newDirection);
    }

    getScore(){
        return this.score;
    }

    addScore(_score){
        this.score += _score;
    }

    gameOver(){
        console.log('Game Over')
        this.doodle.setPosition(Canva.WIDTH/2 - 37, Canva.HEIGHT-75)
        this.score = 0
        this.platforms = [];
        this.createPlatforms()
    }

    bindDisplay(callback) {
        this.doodleDisplay = callback;
    }

    bindPlatformDisplay(callback){
        this.platformDisplay = callback
    }

    bindScoreDisplay(callback){
        this.scoreDisplay = callback
    }

    removePlatform(platform) {
        let index = this.platforms.indexOf(platform);
        this.platforms.splice(index, 1);
    }

    update(fps){
        this.doodle.move(fps, this.platforms, this.doodleDisplay);
        for (let i = 0; i < this.platforms.length; i++){
            let platform = this.platforms[i];
            if (platform.direction === 1 && platform.position.x > Canva.WIDTH - platform.width) {
                platform.direction = -1;
            } else if (platform.direction === -1 && platform.position.x < 0) {
                platform.direction = 1;
            }
            platform.display(this.platformDisplay)
            if (platform.type === 1) {
                platform.move(this.doodleDisplay);
            }
        }
        
        this.scoreDisplay(this.score)
    }
}

export {Model}