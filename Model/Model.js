import { Doodle } from "./Doodle.js";
import { Platform } from "./Platform.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Model{
    static canvaHeight = 510;
    static canvaWidth = 310;

    constructor(){
        this.doodle = new Doodle(75, 75, 150, 435); 
        this.platforms = [];
        this.score = 0;
        
        this.createPlatforms()

        this.doodle.bindAddScore(this.addScore.bind(this));
        this.doodle.bindGetScore(this.getScore.bind(this));
        this.doodle.bindGameOver(this.gameOver.bind(this));
    }

    createPlatforms(){
        let lastHeight = 0;
        for(let i = 1; i < 7; i+= 0.25){
            for(let j = 0; j < 10*i; j++){
                let rand = getRandomInt(10)
                this.platforms.push(new Platform(57, 15, getRandomInt(Model.canvaWidth-57), Model.canvaHeight - (lastHeight + 30*i), rand===9 ? 2 : rand === 8 ? 1 : 0))
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

    update(fps){
        this.doodle.move(fps, this.platforms, this.doodleDisplay);
        
        for(let i = 0; i < this.platforms.length; i++){
            this.platforms[i].display(this.platformDisplay)
        }
        
        this.scoreDisplay(this.score)
    }
}

export {Model}