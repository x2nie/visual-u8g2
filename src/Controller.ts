// Inspired by "Todo List App (with reactivity)" https://odoo.github.io/owl/playground/

import { reactive, useEnv, useState } from "@odoo/owl";
import { LayerCall } from "./components/layers/Layer";
import * as monaco from "monaco-editor"

const sender = 'controller'; //for monaco plugin debug log

class Controller {
    current : LayerCall;
    hover : LayerCall;
    // public readonly model : editor.ITextModel;
    // get model() : editor.ITextModel { return this._model};

    editor: monaco.editor.IStandaloneCodeEditor;
    get model() : monaco.editor.ITextModel{
        return this.editor.getModel()
    };
    setEditor(editor:monaco.editor.IStandaloneCodeEditor){
        this.editor = editor
    }
    

    beginUndoGroup(){
        this.model?.pushStackElement(); // Mulai grup undo
    }
    endUndoGroup(){
        this.model?.pushStackElement(); // Mulai grup undo lain, 
    }

    undo(){
        this.editor.trigger(sender, 'undo', null)
    }
    redo(){
        this.editor.trigger(sender, 'redo', null)
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