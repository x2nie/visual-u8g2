import { Component, useState, xml } from "@odoo/owl";

export class LayerBox extends Component{
    setup(){
        this.sim = useState(this.env.sim)
    }
}

LayerBox.template = xml`
<div class="layer-box">
    <div class="layer" t-foreach="sim.layers" t-as="layer" t-key="layer_index">
        <t t-out="layer.f" />
    </div>
</div>
`