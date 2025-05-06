import { Component, useState, xml } from "@odoo/owl";

export default class Zoom extends Component {
    static template = xml`<input type="range" min="1" max="12" t-model="sim.scale" />`
    setup(){
        this.sim = useState(this.env.sim)
    }
}