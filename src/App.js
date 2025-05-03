import { Component, xml } from "@odoo/owl";
import { Editor } from "./components/editor/Editor";

import './App.scss'

export default class App extends Component {
    static components = {Editor}
    static template = "App"
   
}