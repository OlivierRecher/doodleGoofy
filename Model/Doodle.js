import { GameObject } from "./GameObject.js";

class Doodle extends GameObject {
  static GRAVITY = 20;
  static JUMP_FORCE = 720;
  static SPEED = 300;
  static MAX_JUMP_HEIGHT = 200;

  constructor(_width, _height, _x, _y) {
    super(_width, _height, _x, _y);
    this.direction = 0;
    this.gravitySpeed = 0;
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

  bindAddScore(callback){
    this.addScore = callback;
  }

  bindGetScore(callback){
    this.getScore = callback
  }

  bindGameOver(callback){
    this.gameOver = callback;
  }

  bindRemovePlatform(callback) {
    this.removePlatform = callback;
  }

  move = (fps, platforms, cb) => {
    let canvaWidth = 310
    let canvaHeight = 510
    let falling = this.gravitySpeed > 60
    this.gravitySpeed += Doodle.GRAVITY;
    
    this.position.x += (this.direction * Doodle.SPEED) / fps;
    if(this.position.x+this.width < 0) this.position.x = canvaWidth;
    else if(this.position.x > canvaWidth) this.position.x = -this.width;
    
    this.position.y += this.gravitySpeed / fps;
    let diff = Doodle.MAX_JUMP_HEIGHT - this.position.y;
    
    if(diff > 0) {
      this.position.y += diff;
      this.addScore(Math.round(diff))
    }

    let base = canvaHeight;
    let platformHitted = null;

    for(let i = 0; i < platforms.length; i++){
      let platform = platforms[i];

      if(diff > 0) platform.setY(platform.getY() + diff)

      if((Math.max(this.position.x+20, platform.getX()) < Math.min(this.position.x+this.width-20, platform.getX()+platform.getWidth()))
      && ((this.position.y+this.height) < (platform.getY()+platform.getHeight())) && falling && ((this.position.y+this.height) < base)){
        base = platform.getY();
        platformHitted = platform;  
      }
    }

    if (this.position.y + this.height > base) {
        if (base === canvaHeight && this.getScore && this.getScore() > 0) {
            this.gameOver();
            return;
        }
      this.jump();
      if (platformHitted && platformHitted.type === 2) {
        this.removePlatform(platformHitted);
      }
    }

    cb(this.position);
  };

  jump() {
    this.gravitySpeed = -Doodle.JUMP_FORCE;
  }
}

export { Doodle };
