import { Component, onMounted, useEffect, useRef, useState, xml } from "@odoo/owl";
import { transpile } from "../../util/cpp2javascript";
import { parse_ino } from "./u8g2_eval";
import { displays } from "../../displays/Displays";
import { runCode, U8G2 } from "../../util/U8G2";

const CALL_LOOP = '; try{ setup(); loop(); } catch(err) {console.log("error-evaluate-loop:"+err.message);}'
export class Parser extends Component{
    setup(){
        this.state = useState({x:0, y:0})
        this.canvasRef = useRef('canvas')
        this.canvas = null;
        this.ctx = null;
        this.sim = useState(this.env.sim);
        this.display = displays.find(d => d.name == this.sim.display_name)

        useEffect(
            (canvas)=>{
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d')
                this.u8g2 = new U8G2(this.ctx, this.display)
                this.btnClick()
            },
            ()=>[this.canvasRef.el]
        )

        onMounted(()=>{
            if(this.display.scrollTop){
                this.canvas.parentElement.parentElement.scrollTop = (this.display.scrollTop * this.sim.scale)
            }
        })
    }

    btnClick(){
        let code = this.env.editor.content;
        code = transpile(code)
        console.log(code)

        const layers = parse_ino(code + CALL_LOOP)
        for(const d of layers){
            console.log(d)
        }
        this.sim.layers = layers

        // const {u8g2} = this;
        // eval(code + CALL_LOOP)
        runCode(this.u8g2, code + CALL_LOOP)
    }

    canvasMouseMove(ev){
        const scale = this.sim.scale
        const round = (n) => Math.floor(n)
        // console.log(`x:${round(ev.offsetX/scale)} y:${round(ev.offsetY / scale)}`)
        this.state.x = ev.offsetX * scale;
        this.state.y = ev.offsetY * scale;
        console.log(`x:${ev.offsetX} y:${ev.offsetY}`)
    }
}

Parser.template = xml`
    <button t-on-click="btnClick">Parse!</button>
    <canvas t-portal="'#device'" t-ref="canvas" 
        id="lcd"
        t-on-mousemove="canvasMouseMove"
        t-att-width="display.width" t-att-height="display.height"
        />
    <style t-if="display.css" type="text/css" t-out="display.css"></style>
        <!-- t-attf-style="transform: scale(#{sim.scale});" -->
    <!-- <div t-portal="'#canvas-container'" class="box" 
        t-attf-style="left: #{state.x}px; top: #{state.y}px; width:#{sim.scale}px; height:#{sim.scale}px;"/> -->
`