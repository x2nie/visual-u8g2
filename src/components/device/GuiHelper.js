import { Component, useEffect, useRef, useState, xml } from "@odoo/owl";
import { runCode, U8G2 } from "../../util/U8G2";
import { layerAt } from "./layerFinder";

export default class GuiHelper extends Component{
    setup(){
        this.state = useState({x:-1, y:-1, dragging:false})
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

    onMouseDown(ev) {
        if(!this.layer)
            return
        const layer = this.layer
        this.state.dragging = true;

        const logical_parameters = this.env.editor.getFunctionParameter(layer.l, layer.c)
        console.log('original:', logical_parameters)

        //? save state, so "layer" becoming persistent during dragging until mouse-up
        const {x,y,w,h} = layer.bound;
        const args = [...this.layer.args];  //actual value passed to u8g2.function()
        const [cx,cy] = [ev.offsetX, ev.offsetY]
        let [laxtx,lasty] = [cx,cy]

        const resizer = ev => {
            if(ev.offsetX==laxtx && ev.offsetY==lasty) return; //? dont redraw too fast
            laxtx = ev.offsetX;
            lasty = ev.offsetY;

            const dx = ev.offsetX - cx;
            const dy = ev.offsetY - cy;
            // console.log(`distance: x:${dx} y:${dy}`)
            const layer = this.layer
            layer.bound.x = x +  dx;
            layer.bound.y = y +  dy;
            layer.args[0] = args[0] +  dx;
            layer.args[1] = args[1] +  dy;
            this.drawHelper()

            this.updateSourceCode(layer, args, logical_parameters)

        };
        // const resizerBind = resizer.bind(this)
    
        this.canvas.addEventListener("mousemove", resizer);
    
        this.canvas.addEventListener("mouseup", () => {
            this.state.dragging = false;
            this.canvas.removeEventListener("mousemove", resizer);
        });
    }

    /**
     * make correction into current source code
     * @param {Layer} layer 
     * @param {Arguments[]} old_args Function arguments
     */
    updateSourceCode(layer, oldArgs, parameter_strings){
        const {f,l,args} = layer
        // let argStr = JSON.stringify(layer.args)
        // argStr = argStr.slice(1,argStr.length-1)

        const newArgs = args.map((val,i)=>{
            // Jika literal angka
            let param = parameter_strings[i] || undefined
            if(param===undefined){
                return String(val)
            }
            if (/^\s*[+-]?\d+(\.\d+)?\s*$/.test(param)) {
                const oldVal = parseInt(param);
                return param.replace(String(oldVal), String(val))
            } else {
                return String(val)
            }
        })
        // debugger
        const argStr = newArgs.join(',')

        let code = `    u8g2.${f}(${argStr});`
        console.log(`update #${l}| ${code} ori:`,parameter_strings)
        this.env.editor.editLine([ [[l, l],[code]] ])
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

        this.layer = layerAt(x,y, this.sim.layers)
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