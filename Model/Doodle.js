import {GameObject} from "./GameObject.js"

class Doodle extends GameObject{
    static GRAVITY = 20;
    static JUMP_FORCE = 500;
    static SPEED = 200;

    constructor (_width, _height, _x, _y) {
        super(_width, _height, _x, _y);
        this.direction = 0;                
        this.gravitySpeed = 0;
    }

    getPosition = () => { return this.position; }

    getDirection = () => { return this.direction; }

    setDirection = (value) => { 
        return this.direction = value; 
    }

    BindDoodleDisplay(callback) {
        this.b_Display = callback;
    }

    Move = (fps) => {
        this.gravitySpeed += Doodle.GRAVITY;
        this.position.y += this.gravitySpeed / fps;
        this.position.x += this.direction * Doodle.SPEED / fps;

        if (this.position.y > 100) {
            this.jump();
        }

        this.b_Display(this.position);
    }

    jump() {
        this.gravitySpeed = Doodle.JUMP_FORCE;
    }
}

export {Doodle}