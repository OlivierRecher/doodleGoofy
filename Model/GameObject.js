class GameObject{
    constructor (_width, _height, _x, _y) {
        this.width = _width;
        this.height = _height;
        this.position = {x:_x, y:_y};
    }

    getPosition() {
        return this.position;
    }

    getX() {
        return this.position.x;
    }

    getY() {
        return this.position.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getCenter = () => {
        return {x:this.position.x + this.width/2, y:this.position.y + this.height/2}
    }
}

export {GameObject};