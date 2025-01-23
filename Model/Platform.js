import {GameObject} from "./GameObject.js"

class Platform extends GameObject{
    constructor (_width, _height, _x, _y) {
        super(_width, _height, _x, _y);
    }
}

export {Platform}