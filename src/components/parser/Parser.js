import { Component, useEffect, useRef, useState, xml } from "@odoo/owl";
import { transpile } from "../../util/cpp2javascript";
import { parse_ino } from "./u8g2_eval";
import { displays } from "../../displays/Displays";
import { runCode, U8G2 } from "../../util/U8G2";

const CALL_LOOP = '; try{ setup(); loop(); } catch(err) {console.log("error-evaluate-loop:"+err.message);}'
export class Parser extends Component{
    setup(){
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
    /*btnClick(){
        const code = this.env.editor.content;
        const regex = /u8g2\.\w+[^;]+;/g;
        let m;

        while ((m = regex.exec(code)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
            });
        }
    }*/
}

Parser.template = xml`
    <button t-on-click="btnClick">Parse!</button>
    <canvas t-portal="'#canvas-container'" t-ref="canvas" 
        class="lcd-canvas"
        t-att-width="display.width" t-att-height="display.height"
    />
`