// Inspired by "Todo List App (with reactivity)" https://odoo.github.io/owl/playground/

import { reactive, useEnv, useState } from "@odoo/owl";
import { LayerCall } from "./components/layers/Layer";

class Controller {
    current : LayerCall;
    hover : LayerCall;

    constructor(){
        
    }


}

//? create a global object accessed via this.env or useController
export function createController():Controller {
    const setup = () => {
        controller.current = null;
    };
    // const initialTasks = JSON.parse(localStorage.getItem("todoapp") || "[]");
    const controller = reactive(new Controller());
    setup(); //? calling reactive.member is needed to make reactive work
    return controller;
}
  
//? accessing the global object above.
export function useController():Controller {
    const env = useEnv();
    return useState(env.controller);
}