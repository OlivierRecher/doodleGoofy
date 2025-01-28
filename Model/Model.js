import { Doodle } from "./Doodle.js";
import { Platform } from "./Platform.js";
import { Canva } from "./Canva.js";
import { Bot } from "./Bot.js";

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Model{
    constructor(){
        this.doodle = new Doodle(75, 75, Canva.WIDTH/2 - 37, Canva.HEIGHT-75); 
        this.bot = new Bot()
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

    // getNeighbors(){
    //     let results = [];
    //     let platformsDisplayed = this.platforms.filter((p) => p.getY() > 0 && p.getY() < Canva.HEIGHT && p.getX() > 0 && p.getX() < Canva.WIDTH)
    //     console.log(platformsDisplayed)
    //     for(let i = 0; i < platformsDisplayed.length; i++){
    //         let platform = platformsDisplayed[i];
    //         let platformCenter = platform.getCenter()
    //         let distance = Math.sqrt(Math.pow(this.doodle.getCenter().x - platformCenter.x, 2) + Math.pow(this.doodle.getCenter().y - platformCenter.y, 2))
    //         if(results.length === 4){
    //             console.log(Math.max(...results.map((r) => r.distance)) > distance)
    //             if(Math.max(...results.map((r) => r.distance)) > distance){
    //                 results[results.findIndex(r => r.distance === Math.max(...results.map((r) => r.distance)))] = {distance:distance, position:platform.getCenter()}
    //             }
    //         }else results.push({distance:distance, position:platform.getCenter()})
    //     }
    //     return results;
    // }

    getNeighbors() {
        const results = [];
        // Filtrer les plateformes affichées dans les limites du canvas
        const platformsDisplayed = this.platforms.filter(
            (p) =>
                p.getY() > 0 &&
                p.getY() < Canva.HEIGHT &&
                p.getX() > 0 &&
                p.getX() < Canva.WIDTH
        );
    
        for (const platform of platformsDisplayed) {
            const platformCenter = platform.getCenter();
            const doodleCenter = this.doodle.getCenter();
            const distance = Math.sqrt(
                Math.pow(doodleCenter.x - platformCenter.x, 2) +
                Math.pow(doodleCenter.y - platformCenter.y, 2)
            );
    
            // Si nous avons déjà 4 résultats, vérifier s'il faut remplacer le plus éloigné
            if (results.length === 4) {
                const maxDistanceIndex = results.findIndex(
                    (r) => r.distance === Math.max(...results.map((r) => r.distance))
                );
                if (results[maxDistanceIndex].distance > distance) {
                    results[maxDistanceIndex] = { distance, position: platformCenter };
                }
            } else {
                // Ajouter directement si moins de 4 résultats
                results.push({ distance, position: platformCenter });
            }
        }
    
        // Retourner les résultats triés par distance croissante
        return results.sort((a, b) => a.distance - b.distance);
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
        this.display = callback;
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
        this.doodle.move(fps, this.platforms, this.display);
        for (let i = 0; i < this.platforms.length; i++){
            let platform = this.platforms[i];
            if (platform.direction === 1 && platform.position.x > Canva.WIDTH - platform.width) {
                platform.direction = -1;
            } else if (platform.direction === -1 && platform.position.x < 0) {
                platform.direction = 1;
            }
            platform.display(this.platformDisplay)
            if (platform.type === 1) {
                platform.move(this.display);
            }
        }
        
        if(this.scoreDisplay) this.scoreDisplay(this.score)
    }
}

export {Model}