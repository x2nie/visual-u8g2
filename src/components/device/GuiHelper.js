/**
 * Author: x2nie - Fathony L
 * Date create: 2025-05-07
 * Purpose: Drawing UI guide to visually edit LCD by mouse
 * License: LGPL or Apache 2.0 or MPL 2.1 (Mozilla Public License)
 */

import { Component, useEffect, useRef, useState, xml } from "@odoo/owl";
import { runCode, U8G2 } from "../../util/U8G2";
import { layerAt } from "./layerFinder";
import { LayerFactory, mouseInHandle } from "../layers/Layer";
import { useController } from "../../Controller";

export default class GuiHelper extends Component{
    setup(){
        this.state = useState({x:-1, y:-1, dragging:false})
        this.canvasRef = useRef('helper')
        this.canvas = null;
        this.ctx = null;
        this.sim = useState(this.env.sim);
        this.controller = useController()
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
            () =>this.drawHelper(),
            () => [this.controller.current, this.controller.hover]
        )
    }

    onMouseDown(ev) {
        const [cx,cy] = [ev.offsetX, ev.offsetY]
        const layer = this.controller.current = layerAt(cx,cy, this.sim.layers)
        if(!layer)
            return

        this.state.dragging = true;
        const obj = LayerFactory.from(layer)
        const handles = obj.getHandles();
        let handleIndex = handles.findIndex(h => mouseInHandle(cx,cy, h))
        if(handleIndex==-1) handleIndex = handles.findIndex(h => h.type=='whole' || h.type=='centroid')
        const handle = handles[handleIndex]

        const logical_parameters = this.env.editor.getFunctionParameter(layer.l, layer.c)
        // console.log('original:', logical_parameters)

        //? save state, so "layer" becoming persistent during dragging until mouse-up
        // const {x,y,w,h} = layer.bound;
        const args = [...layer.args];  //actual value passed to u8g2.function()
        let [laxtx,lasty] = [cx,cy]
        let moved = false;

        const mouseMoved = ev => {
            if(ev.offsetX==laxtx && ev.offsetY==lasty) return; //? dont redraw too fast
            laxtx = ev.offsetX;
            lasty = ev.offsetY;

            if(!moved){ //? this is first time moved, so its time to create a new undo group
                moved = true
                this.controller.beginUndoGroup()
            }

            const dx = ev.offsetX - cx;
            const dy = ev.offsetY - cy;
            // console.log(`distance: x:${dx} y:${dy}`)
            // const layer = this.layer
            // layer.bound.x = x +  dx;
            // layer.bound.y = y +  dy;
            // layer.args[0] = args[0] +  dx;
            // layer.args[1] = args[1] +  dy;
            obj.moveHandle(handleIndex, handle.x+dx, handle.y+dy)
            this.drawHelper()

            this.updateSourceCode(layer, args, logical_parameters)

        };
        // const resizerBind = resizer.bind(this)
    
        this.canvas.addEventListener("mousemove", mouseMoved);
    
        this.canvas.addEventListener("mouseup", () => {
            this.state.dragging = false;
            this.controller.endUndoGroup(); // end of undo items group
            this.canvas.removeEventListener("mousemove", mouseMoved);
        });
    }

    /**
     * make correction into current source code
     * @param {Layer} layer 
     * @param {Arguments[]} old_args Function arguments
     */
    updateSourceCode(layer, oldArgs, parameter_strings){
        const {f,l,c,args} = layer
        // let argStr = JSON.stringify(layer.args)
        // argStr = argStr.slice(1,argStr.length-1)

        const newArgs = args.map((val,i)=>{
            let param = parameter_strings[i] || undefined
            if(param===undefined){
                return String(val)
            }
            //? Jika literal angka
            if (/^\s*[+-]?\d+(\.\d+)?\s*$/.test(param)) {
                const oldVal = parseInt(param);
                return param.replace(String(oldVal), String(val))
            } 
            else if (/U8G2_DRAW_/.test(param)) {
                const corners = []
                if(val & 0x01) corners.push('U8G2_DRAW_UPPER_RIGHT');
                if(val & 0x02) corners.push('U8G2_DRAW_UPPER_LEFT');
                if(val & 0x04) corners.push('U8G2_DRAW_LOWER_LEFT');
                if(val & 0x08) corners.push('U8G2_DRAW_LOWER_RIGHT');
                return ' '+ corners.join(' | ')
            } 
            let match = param.match(/(.*[\w\)\]\n\s]+.*)(\s*[+-]\s*)(\d+(\.\d+)?)\s*$/m);
            if (match) {
                let [_, fixed, operator, num] = match;
                const oldActual = oldArgs[i];  // received by func.call
                const delta = val - oldActual;
                const minus = operator.trim() == '-'
                const oldNum = parseInt(num) * (minus?-1:1);  // part of param, not standalone
                let newNum = oldNum + delta;
                operator = operator.replace(/[+-]/, newNum <0? '-': '+')
                newNum = Math.abs(newNum)

                return `${fixed}${operator}${newNum}`
            } 
            else {
                const oldActual = oldArgs[i];  // received by func.call
                const delta = val - oldActual;
                if(delta==0 || val == oldActual){
                    return param
                }
                const operator = delta < 0? ' - ': ' + ';
                const newNum = Math.abs(delta)
                return `${param}${operator}${newNum}`
            }
        })
        // debugger
        const argStr = newArgs.join(',')

        // let code = `    u8g2.${f}(${argStr});`
        let code = `${f}(${argStr});`
        // console.log(`update #${l}| ${code} ori:`,parameter_strings)
        // console.log(`update #${l}| ${code}`)
        this.env.editor.editLine([ [[l,c, l],[code]] ])
    }

    canvasMouseHover(ev){
        if(this.state.dragging) 
            return;
        const scale = this.sim.scale
        // const round = (n) => Math.floor(n)
        // console.log(`x:${round(ev.offsetX/scale)} y:${round(ev.offsetY / scale)}`)
        // this.state.x = ev.offsetX * scale;
        // this.state.y = ev.offsetY * scale;
        // console.log(`x:${ev.offsetX} y:${ev.offsetY}`)
        const x = ev.offsetX;
        const y = ev.offsetY;
        if(x==this.state.x && y==this.state.y) return; //don't redraw too fast
        this.state.x = x;
        this.state.y = y;

        const layer = layerAt(x,y, this.sim.layers)
        if(layer==this.controller.hover) 
            return; // no ui update is needed

        this.controller.hover=layer;
        // debugger
        //this.obj = LayerFactory.from(layer)
        // console.log(`x:${x} y:${y} layer:`)
        this.drawHelper()
    }
    canvasMouseOut(){
        if(this.state.dragging) 
            return;

        this.layer = null;
        this.drawHelper()
    }
    drawHelper(){
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0,0,canvas.width, canvas.height)

        const drawBound = (layer) => {
            if(layer == null) return
            if(!layer.bound){
                const obj = LayerFactory(layer)
                obj.updateBound()
            }

            // ctx.fillStyle = 'white';
            ctx.lineWidth = 2;
            ctx.lineWidth = 1;
            // ctx.setLineDash([3, 5]);
            ctx.strokeStyle = 'white';
            
            let {x,y,w,h} = layer.bound;
            w++;
            h++;
            // console.log(`${layer.f} x:${x} y:${y} layer:`, layer ? layer.bound: null)
            // ctx.rect(x, y, w, h);
            // ctx.strokeRect(x, y, w, h);
            if(['drawDisc','drawCircle','drawEllipse'].includes(layer.f) ){
                const rx = w / 2;
                const ry = h / 2;
                const cx = x + w / 2;
                const cy = y + h / 2;
                ctx.beginPath()
                ctx.ellipse(cx*s*hor, cy*s*ver, rx*s*hor, ry*s*ver, 0, 0, 2* Math.PI);
                ctx.stroke();
            } else {
                ctx.strokeRect(x*s*hor, y*s*ver, w*s*hor, h*s*ver);
            }
            //this.drawHintLayer()
        }

        const s = this.sim.scale
        const [hor,ver] = this.sim.display.screenRatio;
        const current = this.controller.current;
        if(current){
            const obj = LayerFactory.from(current)
            const handles = obj.getHandles()
            ctx.fillStyle = 'lime';
            handles.forEach(({x,y, type}) =>{
                switch (type) {
                    case 'centroid':
                    case 'start':
                        ctx.beginPath()
                        ctx.fillStyle = type=='centroid'?'aqua':'lime';
                        ctx.rect((x)*s*hor, (y)*s*ver, s*hor, s*ver)
                        ctx.fill();
                        break;
                    case 'end':
                        ctx.beginPath()
                        ctx.fillStyle = 'red';
                        ctx.rect((x)*s*hor, (y)*s*ver, s*hor, s*ver)
                        ctx.fill();
                        break;
                    case 'radius':
                        ctx.beginPath()
                        ctx.fillStyle = 'fuchsia';
                        ctx.rect((x)*s*hor, (y)*s*ver, s*hor, s*ver)
                        ctx.fill();
                        break;
                    case 'whole':
                        break
                
                    default:
                        ctx.beginPath()
                        ctx.ellipse((0.5+x)*s*hor, (0.5+y)*s*ver, 10, 10, 0, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    }
            })
            // ctx.fill();
            drawBound(current)
        }
        const hover = this.controller.hover;
        if(hover){
            drawBound(hover)
        }

    }
    
    drawHintLayer(){
        const {f,args} = this.layer
        let arg = JSON.stringify(args)
        arg = arg.slice(1,arg.length-1)
        let code = `u8g2.${f}(${arg});`
        console.log('draw: ', code)
        //set to white
        // while(this.u8g2.display.colorMap.length < 4){
            this.u8g2.display.colorMap[3] = '#ffffff'
        // }
        runCode(this.u8g2, 'u8g2.setDrawColor(3);' )
        runCode(this.u8g2, code )
    }
}

GuiHelper.template = xml`
    <canvas t-ref="helper" 
        class="lcd "
        t-on-mousedown="onMouseDown"
        t-on-mousemove="canvasMouseHover"
        t-on-mouseleave="canvasMouseOut"
        t-att-width="sim.display.width*sim.scale*sim.display.screenRatio[0]" t-att-height="sim.display.height*sim.scale*sim.display.screenRatio[1]"
        t-attf-style="width:#{sim.display.width}px; height:#{sim.display.height}px;"
        />
`