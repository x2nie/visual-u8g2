import { Component, useState, xml } from "@odoo/owl";
import { useController } from "../../Controller";

import './LayerBox.scss'

export class LayerBox extends Component{
    setup(){
        this.sim = useState(this.env.sim)
        this.controller = useController()
    }

    itemMouseEnter(ev){
        const index = parseInt(ev.target.getAttribute('item'))
        this.controller.hover = this.sim.layers[index]
    }
    itemClick(ev){
        const index = parseInt(ev.target.getAttribute('item'))
        this.controller.current = this.sim.layers[index]
    }
    onMouseLeave(){
        this.controller.hover = null
    }
}

LayerBox.template = xml`
<div class="layer-box" t-on-mouseleave="onMouseLeave">
    <t t-foreach="sim.layers" t-as="layer" t-key="layer_index">
        <div class="layer" 
            t-on-mouseenter="itemMouseEnter" 
            t-on-click="itemClick" 
            t-att-item="layer_index" 
            t-att-class="{active: layer==controller.hover}"
        >
            <t t-out="layer.f" />
        </div>
    </t>
</div>
`