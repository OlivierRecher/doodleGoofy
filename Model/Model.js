import { Doodle } from "./Doodle.js";
import { Platform } from "./Platform.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Model{
    constructor(){
        this.doodle = new Doodle(75, 75, 150, 435); 
        this.platforms = [];
        let canvaHeight = 510;
        let canvaWidth = 310;

        for(let i = 0; i < 20; i++){
            this.platforms.push(new Platform(57, 15, getRandomInt(canvaWidth-57), canvaHeight - (200*i), getRandomInt(3)))
        }
    }

    getDirection(){
        return this.doodle.getDirection();
    }

    setDirection(newDirection){
        this.doodle.setDirection(newDirection);
    }

    bindDisplay(callback) {
        this.doodleDisplay = callback;
    }

    bindPlatformDisplay(callback){
        this.platformDisplay = callback
    }

    update(fps){
        this.doodle.move(fps, this.platforms, this.doodleDisplay);
        
        for(let i = 0; i < this.platforms.length; i++){
            this.platforms[i].display(this.platformDisplay)
        }
    }
}

export {Model}