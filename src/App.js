import { Component, useState, xml } from "@odoo/owl";
import { Editor } from "./components/editor/Editor";
// import { Parser } from "./components/parser/Parser";
import { LayerBox } from "./components/layers/LayerBox";
import Device from "./components/device/Device";

import './App.scss'
// import './style.scss'

export default class App extends Component {
    static components = {Editor, Device, LayerBox}
    static template = "App"

    setup(){
        this.sim = useState(this.env.sim);
    }
   
}