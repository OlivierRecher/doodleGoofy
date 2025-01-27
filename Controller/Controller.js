import { Model } from "../Model/Model.js";
import { View } from "../View/View.js";

// import { Platform } from "../Model/Platform";

class Controller {
    constructor(_assets){
        this.model = new Model();
        this.view = new View(_assets);

        this.startTime = Date.now();
        this.lag = 0;
        this.fps = 60;
        this.frameDuration = 1000 / this.fps;

        this.model.bindDisplay(this.display.bind(this));
        this.model.bindPlatformDisplay(this.platformDisplay.bind(this));
        this.view.bindSetDirection(this.setDirection.bind(this));
        this.view.bindGetDirection(this.getDirection.bind(this));
    }

    display = (position) => {
        this.view.Display(position);
    }

    platformDisplay = (type, position) => {
        this.view.platformDisplay(type, position);
    }

    setDirection(newDirection) {
        this.model.setDirection(newDirection);
    }

    getDirection() {
        return this.model.getDirection();
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
            this.model.update(this.fps);
            /* Réduire la variable _lag par la durée d'une frame */
            this.lag -= this.frameDuration;
        }
        
        requestAnimationFrame(this.update.bind(this)); // La fonction de rappel est généralement appelée 60 fois par seconde.
    }
}

export {Controller}