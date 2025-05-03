import { Component, xml } from "@odoo/owl";
import { Editor } from "./components/editor/Editor";
import { Parser } from "./components/parser/Parser";
import { LayerBox } from "./components/layers/LayerBox";

import './App.scss'
// import './style.scss'

export default class App extends Component {
    static components = {Editor, Parser, LayerBox}
    static template = "App"
   
}