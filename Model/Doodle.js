import { GameObject } from "./GameObject.js";

class Doodle extends GameObject {
  static GRAVITY = 20;
  static JUMP_FORCE = 750;
  static SPEED = 200;

  constructor(_width, _height, _x, _y) {
    super(_width, _height, _x, _y);
    this.direction = 0;
    this.gravitySpeed = 0;
    this.jumpValue = _y+_height
  }

  getPosition = () => {
    return this.position;
  };

  getDirection = () => {
    return this.direction;
  };

  setDirection = (value) => {
    this.direction = value;
  };

  bindDoodleDisplay(callback) {
    this.b_Display = callback;
  }

  move = (fps, platforms, cb) => {
    let canvaWidth = 310
    let canvaHeight = 510
    let falling = this.position.y < this.gravitySpeed
    this.gravitySpeed += Doodle.GRAVITY;
    
    this.position.x += (this.direction * Doodle.SPEED) / fps;
    if(this.position.x+this.width < 0) this.position.x = canvaWidth
    else if(this.position.x > canvaWidth) this.position.x = -this.width
    
    this.position.y += this.gravitySpeed / fps;

    let base = canvaHeight

    for(let i = 0; i < platforms.length; i++){
      let platform = platforms[i]
      if(Math.max(this.position.x+20, platform.getX()) < Math.min(this.position.x+this.width-20, platform.getX()+platform.getWidth())
      && (this.position.y+this.height) < platform.getY()+platform.getHeight() && falling){
        base = platform.getY();
      }
    }

    if (this.position.y + this.height > base) {
      this.jump();
    }

    cb(this.position);
  };

  jump() {
    this.gravitySpeed = -Doodle.JUMP_FORCE;
  }
}

export { Doodle };
