import { ModelAi } from "../Model/ModelAi.js";
import { ViewAi } from "../View/ViewAi.js";
import { Controller } from "./Controller.js";

class ControllerAi extends Controller{
    constructor(_assets){
        super(_assets);
        this.view = new ViewAi(_assets)
        this.model = new ModelAi()

        this.view.bindGetNeightbors(this.getNeightbors.bind(this))
    }

    getNeightbors(){
        this.model.getNeightbors()
    }
}

export {ControllerAi}