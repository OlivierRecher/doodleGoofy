import { Canva } from "../Model/Canva.js";
import { doodleLeft, doodleRight } from "./DoodleView.js";

class View {
  constructor(_assets) {
    this._canvas = document.getElementById("my_canvas");
    this._canvas.width = Canva.WIDTH
    this._canvas.height = Canva.HEIGHT
    this.ctx = this._canvas.getContext("2d");
    this._hold_right = false;
    this._hold_left = false;
    this.assets = _assets

    this.events();
  }

  bindSetDirection(callback) {
    this.b_SetDirection = callback;
  }

  bindGetDirection(callback) {
    this.b_GetDirection = callback;
  }

  bindGetNeighbors(callback){
    this.getNeighbors = callback
  }

  events() {
    document.addEventListener("keydown", (evt) => {
      if (evt.key == "ArrowLeft" || evt.key == "ArrowRight") {
        switch (evt.key) {
          case "ArrowLeft": // Move left.
            this._hold_left = true;
            this.b_SetDirection(-1);
            break;
          case "ArrowRight": // Move right.
            this._hold_right = true;
            this.b_SetDirection(1);
            break;
        }
      }
    });

    document.addEventListener("keyup", (evt) => {
      switch (evt.key) {
        case "ArrowLeft": // Move left.
          if (!this._hold_right) {
            this.b_SetDirection(0);
          }
          this._hold_left = false;
          break;
        case "ArrowRight": // Move right.
          if (!this._hold_left) {
            this.b_SetDirection(0);
          }
          this._hold_right = false;
          break;
      }
    });
  }

  Display(position) {
    let x = position.x;
    let y = position.y;
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    let neighbors = this.getNeighbors()
    let colors = ['red', 'yellow', 'blue', 'green']
    for(let i = 0; i < neighbors.length; i++){
      if(neighbors[i].distance > 0){
        this.ctx.beginPath();
        this.ctx.moveTo(x+35, y+35);
        this.ctx.lineTo(neighbors[i].position.x, neighbors[i].position.y);
        this.ctx.strokeStyle = colors[i];
        this.ctx.stroke();
      }
      
    }

    let doodle = this.b_GetDirection() == 1 ? doodleRight : doodleLeft;
    this.ctx.globalCompositeOperation='destination-over';
    this.ctx.drawImage(doodle, x, y, 75, 75);
  }

  platformDisplay(type, position){
    let x = position.x;
    let y = position.y;
    switch (type){
      case 0 :
        this.ctx.drawImage(this.assets, 1, 1, 57, 15, x, y, 57, 15)
        break
      case 1 : 
        this.ctx.drawImage(this.assets, 1, 19, 57, 15, x, y, 57, 15)
        break
      case 2 : 
        this.ctx.drawImage(this.assets, 1, 55, 57, 15, x, y, 57, 15)
        break
    }
  }

  scoreDisplay(_score){
    this.ctx.font = "24px serif";
    this.ctx.fillText(_score, 20, 30);
  }
}

export { View };