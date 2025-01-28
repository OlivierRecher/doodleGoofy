import { View } from "./View.js";

class ViewAi extends View{
    constructor(_assets){
        super(_assets)
    }

    bindGetNeightbors(callback){
        this.getNeightbors = callback;
        callback()
    }
}

export {ViewAi}