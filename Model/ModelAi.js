import { Model } from "./Model.js";

class ModelAi extends Model{
    constructor () {
        super()
    }

    getNeightbors(){
        console.log(this.platforms)
    }
}

export {ModelAi}