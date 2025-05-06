import { Component, useState, xml } from "@odoo/owl";
import { Editor } from "./components/editor/Editor";
// import { Parser } from "./components/parser/Parser";
import { LayerBox } from "./components/layers/LayerBox";
import Device from "./components/device/Device";

import './App.scss'
import Zoom from "./components/zoom/Zoom";
// import './style.scss'

export default class App extends Component {
    static components = {Editor, Device, LayerBox, Zoom}
    static template = "App"

    setup(){
        this.heights = useState({navbar:48, preview:215})
        this.sim = useState(this.env.sim);
    }
   
    onSplitterMouseDown() {
        const resizer = ev => {
          this.heights.preview = ev.clientY - this.heights.navbar;
        };
    
        document.body.addEventListener("mousemove", resizer);
        // for (let iframe of document.getElementsByTagName("iframe")) {
        //     iframe.classList.add("disabled");
        // }
    
        document.body.addEventListener("mouseup", () => {
            document.body.removeEventListener("mousemove", resizer);
            // for (let iframe of document.getElementsByTagName("iframe")) {
            //     iframe.classList.remove("disabled");
            // }
        });
      }
}