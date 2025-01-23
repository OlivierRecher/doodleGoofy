class GameObject{
    constructor (_width, _height, _x, _y) {
        this.width = _width;
        this.height = _height;
        this.position = {x:this._x, y:this._y};
    }
}

export {GameObject};