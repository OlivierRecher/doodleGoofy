import { Doodle } from "./Doodle.js";
import { Platform } from "./Platform.js";

class Model{
    constructor(){
        this.doodle = new Doodle(75, 75, 150, 435); 
        this.platforms = [];

        for(let i = 0; i < 8; i++){
            this.platforms.push(new Platform(57, 15, 100*(i+1), 200*(i+1), 1))
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