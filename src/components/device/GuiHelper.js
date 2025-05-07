import { Component, useEffect, useRef, useState, xml } from "@odoo/owl";
import { U8G2 } from "../../util/U8G2";
import { layerAt } from "./layerFinder";

export default class GuiHelper extends Component{
    setup(){
        this.state = useState({x:0, y:0})
        this.canvasRef = useRef('helper')
        this.canvas = null;
        this.ctx = null;
        this.sim = useState(this.env.sim);
        this.layer = null; // layer on mouse move

        useEffect(
            (canvas)=>{
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d')
                this.u8g2 = new U8G2(this.ctx, this.sim.display)
                // this.renderLcd()
            },
            ()=>[this.canvasRef.el]
        )

        useEffect(
            (layer) =>{},
            () => [this.state.hoverLayer]
        )
    }
    canvasMouseMove(ev){
        const scale = this.sim.scale
        // const round = (n) => Math.floor(n)
        // console.log(`x:${round(ev.offsetX/scale)} y:${round(ev.offsetY / scale)}`)
        // this.state.x = ev.offsetX * scale;
        // this.state.y = ev.offsetY * scale;
        // console.log(`x:${ev.offsetX} y:${ev.offsetY}`)
        const x = ev.offsetX;
        const y = ev.offsetY;
        this.layer = layerAt(x,y, this.sim.layers)
        console.log(`x:${x} y:${y} layer:`)
        this.drawHelper()
    }
    canvasMouseOut(){
        this.layer = null;
        this.drawHelper()
    }
    drawHelper(){
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0,0,canvas.width, canvas.height)

        const layer = this.layer;
        if(layer){
            // ctx.fillStyle = 'white';
            ctx.lineWidth = 2;
            ctx.lineWidth = 1;
            // ctx.setLineDash([3, 5]);
            ctx.strokeStyle = 'white';
            
            const {x,y,w,h} = layer.bound;
            const s = this.sim.scale
            const [hor,ver] = this.sim.display.screenRatio;
            // console.log(`${layer.f} x:${x} y:${y} layer:`, layer ? layer.bound: null)
            // ctx.rect(x, y, w, h);
            // ctx.strokeRect(x, y, w, h);
            ctx.strokeRect(x*s*hor, y*s*ver, w*s*hor, h*s*ver);
        }
    }
}

GuiHelper.template = xml`
    <canvas t-ref="helper" 
        class="lcd "
        t-on-mousemove="canvasMouseMove"
        t-on-mouseleave="canvasMouseOut"
        t-att-width="sim.display.width*sim.scale*sim.display.screenRatio[0]" t-att-height="sim.display.height*sim.scale*sim.display.screenRatio[1]"
        t-attf-style="width:#{sim.display.width}px; height:#{sim.display.height}px;"
        />
`