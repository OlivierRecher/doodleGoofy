import {GameObject} from "./GameObject.js"

class Platform extends GameObject{
    constructor (_width, _height, _x, _y, _type) {
        super(_width, _height, _x, _y);
        this.type = _type;
    }

    getPosition(){
        return this.position;
    }

    getX(){
        return this.position.x;
    }

    getY(){
        return this.position.y;
    }

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

    setY(_y){
        this.position.y = _y
    }

    display(cb){
        cb(this.type, this.position)
    }
}

export {Platform}