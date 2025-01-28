import { GameObject } from "./GameObject.js"

class Platform extends GameObject {
  constructor(_width, _height, _x, _y, _type) {
    super(_width, _height, _x, _y);
    this.type = _type;
    this.direction = 1;
  }

  setY(_y) {
    this.position.y = _y;
  }

  display(cb) {
    if(cb) cb(this.type, this.position);
  }

  move(cb) {
    this.position.x += this.direction;
  }
}

export {Platform}