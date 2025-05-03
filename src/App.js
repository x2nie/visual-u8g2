import { Component, xml } from "@odoo/owl";
import { Editor } from "./components/editor/Editor";
import { Parser } from "./components/parser/Parser";

import './App.scss'

export default class App extends Component {
    static components = {Editor, Parser}
    static template = "App"
   
}