import { Component, onMounted, toRaw, useEffect, useRef, useState, xml } from "@odoo/owl";
import * as monaco from "monaco-editor"

import { runCode, U8G2 } from "../../util/U8G2";
import { transpile } from "../../util/cpp2javascript";
import { parse_ino } from "../parser/u8g2_eval";
import { layerAt } from "./layerFinder";
import GuiHelper from "./GuiHelper";
import { NetPBM } from "../../util/NetPBM";
import { useController } from "../../Controller";

const CALL_LOOP = '; try{ setup(); loop(); } catch(err) {console.log("error-evaluate-loop:"+err.message);}'

export default class Device extends Component {
    static components = {GuiHelper}
    setup(){
        this.state = useState({x:0, y:0})
        this.deviceRef = useRef('device')
        this.helperRef = useRef('helper')
        this.canvasRef = useRef('canvas')
        this.canvas = null;
        this.ctx = null;
        this.sim = useState(this.env.sim);
        this.editor = useState(this.env.editor);
        this.layer = null; // layer on mouse move
        this.controller = useController()

        useEffect(
            (canvas)=>{
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d')
                this.u8g2 = new U8G2(this.ctx, this.display)
                this.renderLcd()
            },
            ()=>[this.canvasRef.el]
        )

        useEffect(
            ()=>{
                this.renderLcd()
            },
            ()=>[this.editor.content]
        )

        onMounted(()=>{
            if(this.display.scrollTop){
                this.deviceRef.el.parentElement.scrollTop = (this.display.scrollTop * this.sim.scale)
            }
        })
    }

    get display(){
        return this.sim.display
    }

    renderLcd(){
        let code = this.editor.content;
        code = transpile(code)
        // console.log(code)

        const layers = parse_ino(code + CALL_LOOP)
        // for(const d of layers){
        //     console.log(d)
        // }
        this.sim.layers = layers

        // const {u8g2} = this;
        // eval(code + CALL_LOOP)
        // runCode(this.u8g2, 'u8g2.clear()')
        this.u8g2._reset()
        runCode(this.u8g2, code + CALL_LOOP)
    }

    onDropFile(ev){
        ev.preventDefault ();
        for (var i = 0, l = ev.dataTransfer.files.length; i < l; i++) {
			// outstanding++;
			
			var file = ev.dataTransfer.files[i],
				reader = new FileReader();
	
			reader.onload = (event) => {
				var data = event.target.result,
					img;
				try {
					img = new NetPBM(data);
					// addImage (img);
                    const bytes =  img.getMonochromeBytes()
                    console.log(JSON.stringify(bytes));
                    const fileName = 'img_'+ file.name.split('.')[0]
                    // setTimeout(() => {
                        this.addXBM(ev.offsetX, ev.offsetY, img.width, img.height, bytes, fileName)
                        
                    // }, 500);

				} catch (e) {
					alert (e.message);
				}
			
				// outstanding--;
				// checkOutstanding ();
			};
		
			reader.readAsText (file);
		}
    }
    onDragOver(ev){
        ev.preventDefault()
        console.log(ev.offsetX, ev.offsetY)
    }
    async addXBM(x,y,w,h, bytes, name){
        //
        const controller = toRaw(this.controller)
        const model = controller.model
        // const editor
        // const editor = toRaw(this.controller.editor)
        // const model = editor.model
        // const model = toRaw(this.controller.model)
        // const insertLine = toRaw(this.controller.insertLine).bind(this.controller)
        const insertLine = controller.insertLine.bind(controller);
        const data = bytes.map(n => String(n)).join(',')
        insertLine(1,1,1,1, `static const unsigned char ${name}[] = {${data}};\n`)
        
        //? -- search line to insert
        let targetLine = 1;
        let range = null
        // const text = model.getValue()
        // const matches = text.match(/void\s+draw\s*\([^)]*\)\s*\{([\s\S]*?)^\}/gm)
        // const matches = model.findMatches('void draw',true,false, true,null,false, 1)
        const drawOpening = model.findMatches(
            // /^void draw\([^}]+/gm, 
            // /void\s+draw\s*\([^)]*\)\s*\{([\s\S\n]*?)^\}/gm,
            // /^void\s+draw\s*\([\s\S\n]+^\}/gm,
            /void\s+draw\s*\(/gm,
            //     "void\\s+draw\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)^\\}",
            true,true, true,null, true, 1 );
        let drawEnd
        if(drawOpening.length){
            const range = drawOpening[0].range
            range.endLineNumber = 10000
            drawEnd = model.findMatches("}", range,false,false,null,true, 1)
            if(drawEnd.length){
                targetLine = drawEnd[0].range.startLineNumber
            }
        }

        // const insertLine0 = (firstLine, firstCol, lastLine, lastCol, text) =>{
        //     // const model = this.editor.getModel();
        //     const edits = [
        //         // const [firstLine,firstCol,lastLine] = lineNums;
        //         {
        //             range: new monaco.Range(firstLine, firstCol, lastLine, lastCol),
        //             text,
        //             forceMoveMarkers: true
        //         }
        //     ]
        //     model.pushEditOperations([], edits, () => null);
        // }
        insertLine(targetLine,0,targetLine,0, `\tu8g2.drawXBM(${x}, ${y}, ${w}, ${h}, ${name});\n`)
        
        // debugger
    }
    /*
    canvasMouseMove(ev){
        return
        const scale = this.sim.scale
        // const round = (n) => Math.floor(n)
        // console.log(`x:${round(ev.offsetX/scale)} y:${round(ev.offsetY / scale)}`)
        // this.state.x = ev.offsetX * scale;
        // this.state.y = ev.offsetY * scale;
        // console.log(`x:${ev.offsetX} y:${ev.offsetY}`)
        const x = ev.offsetX;
        const y = ev.offsetY;
        this.layer = layerAt(x,y, this.sim.layers)
        // console.log(`x:${x} y:${y} layer:`, layer ? layer.bound: null)
        this.drawHelper()
    }
    canvasMouseOut(){
        this.layer = null;
        this.drawHelper()
    }
    drawHelper(){
        const canvas = this.helperRef.el;
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
            // console.log(`${layer.f} x:${x} y:${y} layer:`, layer ? layer.bound: null)
            // ctx.rect(x, y, w, h);
            // ctx.strokeRect(x, y, w, h);
            ctx.strokeRect(x*s, y*s, w*s, h*s);
        }
    }
    */
}


Device.template = xml`
    <style t-if="display.css" type="text/css" t-out="display.css"></style>
    <div id="device" 
        t-attf-style="transform: scale(#{sim.scale});" 
        t-on-dragover="onDragOver"
        t-on-drop="onDropFile"
        t-ref="device">
        <canvas t-ref="canvas" 
            class="lcd"
            t-on-mousemove="canvasMouseMove"
            t-on-mouseleave="canvasMouseOut"
            t-att-width="display.width" t-att-height="display.height"
            />
        <!-- <canvas t-ref="helper" 
            class="lcd no-mouse"
            t-att-width="display.width*sim.scale" t-att-height="display.height*sim.scale"
            t-attf-style="width:#{display.width}px; height:#{display.height}px;"
            /> -->
        <GuiHelper/>
    </div>
`