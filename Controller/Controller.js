import { Doodle } from "../Model/Doodle.js";
import { View } from "../View/View.js";

// import { Platform } from "../Model/Platform";

class Controller {
    constructor(){
        this.doodle = new Doodle(75, 75, 150, 35);
        this.view = new View();

        this.startTime = Date.now();
        this.lag = 0;
        this.fps = 60;
        this.frameDuration = 1000 / this.fps;

        this.doodle.bindDoodleDisplay(this.display.bind(this));
        this.view.BindSetDirection(this.setDirection.bind(this));
        this.view.BindGetDirection(this.getDirection.bind(this));
    }

    display = (position) => {
        this.view.Display(position);
    }

    setDirection(newDirection) {
        this.doodle.direction = newDirection;
    }

    getDirection() {
        return this.doodle.getDirection();
    }
    
    update() {
        /* Calcul du deltaTime */
        let currentTime = Date.now();
        let deltaTime = currentTime - this.startTime; // La durée entre deux appels (entre 2 frames).
        
        this.lag += deltaTime;
        this.startTime = currentTime;

        /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
        while (this.lag >= this.frameDuration) {
            /* Mise à jour de la logique */
            this.doodle.Move(this.fps);
            /* Réduire la variable _lag par la durée d'une frame */
            this.lag -= this.frameDuration;
        }
        
        requestAnimationFrame(this.update.bind(this)); // La fonction de rappel est généralement appelée 60 fois par seconde.
    }
}

export {Controller}