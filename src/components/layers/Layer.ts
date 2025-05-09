/**
 * Author: x2nie - Fathony L
 * Date create: 2025-05-08
 * Purpose: Interim class to simplify modifying layer visually.
 * License: LGPL or Apache 2.0 or MPL 2.1 (Mozilla Public License)
 */

type CallCommon = {
    lineNo: number;
    columnNo: number;
    bound?: { x: number; y: number; w: number; h: number };
    };

type LineCall = {
    f: 'drawLine';
    args: [number, number, number, number];
    } & CallCommon;

type StrCall = {
    f: 'drawStr';
    args: [number, number, string];
    width?: number;
    height?: number;
    } & CallCommon;

type CircleCall = {
    f: 'drawCircle' | 'drawDisc';
    args: [number, number, number, number]; // x, y, radius, opt
    } & CallCommon;

// type DiscCall = {
//     f: 'drawDisc';
//     args: [number, number, number]; // x, y, radius
//     } & CallCommon;

type EllipseCall = {
    f: 'drawEllipse'|'drawFilledEllipse';
    args: [number, number, number, number]; // x, y, rx, ry
    } & CallCommon;

// type FilledEllipseCall = {
//     f: 'drawFilledEllipse';
//     args: [number, number, number, number]; // x, y, rx, ry
//     } & CallCommon;

type ArcCall = {
    f: 'drawArc';
    args: [number, number, number, number, number]; // x, y, radius, startAngle, endAngle
    } & CallCommon;

type TriangleCall = {
    f: 'drawTriangle';
    args: [number, number, number, number, number, number]; // x0, y0, x1, y1, x2, y2
    } & CallCommon;

type FrameCall = {
    f: 'drawFrame' | 'drawBox';
    args: [number, number, number, number]; // x, y, w, h
    } & CallCommon;
      
export type LayerCall =
    | LineCall
    | StrCall
    | CircleCall
    // | DiscCall
    | EllipseCall
    // | FilledEllipseCall
    | ArcCall
    | TriangleCall
    | FrameCall;

export type Handle = {
    x: number;
    y: number;
    type?: 'centroid' | 'start' | 'end' | 'radius' | 'whole';
}

export function mouseInHandle(x2:number,y2:number, h:Handle){
    const {x,y} = h;
    const dx = x2 - x;
    const dy = y2 - y;
    const delta = dx * dx + dy * dy;
    return delta < 4; // karena 2² = 4
}

class Line {
    constructor(public data: LineCall) {}

    static from(data: LineCall): Line {
        return new Line(data);
    }

    move(dx: number, dy: number) {
        this.data.args[0] += dx;
        this.data.args[1] += dy;
        this.data.args[2] += dx;
        this.data.args[3] += dy;
    }
    getHandles(): Handle[] {
        const [x, y, x2, y2] = this.data.args;
        return [
            { x, y, type:'start' }, //? must be before whole as it it compared first
            { x, y, type:'whole' },          
            { x: x2, y: y2, type:'end' }     
        ];
    }
    moveHandle(index: number, x: number, y: number) {
        const [a, b, c, d] = this.data.args;
        switch (index) {
            case 0:
                this.data.args = [x, y, c, d];
                break;
            case 1:
                const [w,h] = [c - a, d -b];
                this.data.args = [x, y, x+w, y+h];
                break;
            case 2:
                this.data.args = [a, b, x, y]
                break;
        }
        this.updateBound()
    }
    updateBound() {
        const [x1, y1, x2, y2] = this.data.args;
        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const w = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);
        this.data.bound = { x, y, w, h };
    }
    toString(): string {
        const [x0, y0, x1, y1] = this.data.args;
        return `Line from (${x0}, ${y0}) to (${x1}, ${y1})`;
    }
}

class Str {
    constructor(public data: StrCall) {}

    static from(data: StrCall): Str {
        return new Str(data);
    }

    move(dx: number, dy: number) {
        this.data.args[0] += dx;
        this.data.args[1] += dy;
    }
    getHandles(): { x: number; y: number }[] {
        const [x, y] = this.data.args;
        return [
        { x, y },           // baseline
        ];
    }

    updateBound() {
        const [x, y, text] = this.data.args;
        const w = text.length * 6; // asumsi 6px per karakter
        const h = 8;               // asumsi tinggi font 8px
        this.data.bound = { x, y: y - h, w, h };
    }

    toString(): string {
        const [x, y, text] = this.data.args;
        return `Text "${text}" at (${x}, ${y})`;
    }
}
  
class Circle {
    constructor(public data: CircleCall) {}
  
    static from(data: CircleCall): Circle {
        return new Circle(data);
    }

    getHandles(): Handle[] {
        const [x, y, r] = this.data.args;
        return [
            { x, y, type:'centroid' },           // Pusat
            { x: x + r, y, type:'radius' }     // Titik pada radius
        ];
    }

    moveHandle(index: number, x: number, y: number) {
        const [cx, cy, r, opt] = this.data.args;
        switch (index) {
            case 0:
                this.data.args = [x, y, r, opt];
                break;
            case 1:
                this.data.args[2] = x - cx;
                break;
        }
        this.updateBound()
    }

    updateBound() {
        const [x, y, r] = this.data.args;
        this.data.bound = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
    }
}
  
class Disc extends Circle {
    static from(data: CircleCall): Disc {
        return new Disc(data);
    }
}
  
class Ellipse {
    constructor(public data: EllipseCall) {}
  
    static from(data: EllipseCall): Ellipse {
        return new Ellipse(data);
    }

    getHandles(): Handle[] {
        const [x, y, rx, ry] = this.data.args;
        return [
        { x, y, type:'centroid' },               // Pusat
        { x: x + rx, y, type:'radius' },       // Titik pada radius x
        { x, y: y + ry, type:'radius' }        // Titik pada radius y
        ];
    }

    moveHandle(index: number, x: number, y: number) {
        const [cx, cy, rx, ry] = this.data.args;
        switch (index) {
            case 0:
                this.data.args = [x, y, rx, ry];
                break;
            case 1:
                this.data.args[2] = x - cx;
                break;
            case 2:
                this.data.args[3] = y - cy;
                break;
        }
        this.updateBound()
    }

    updateBound() {
        const [x, y, rx, ry] = this.data.args;
        this.data.bound = { x: x - rx, y: y - ry, w: rx * 2, h: ry * 2 };
    }
}

class FilledEllipse extends Ellipse {
    static from(data: EllipseCall): FilledEllipse {
        return new FilledEllipse(data);
    }
}
  
class Arc {
    constructor(public data: ArcCall) {}

    static from(data: ArcCall): Arc {
        return new Arc(data);
    }

    getHandles(): { x: number; y: number }[] {
        const [x, y, r, startAngle, endAngle] = this.data.args;
        // Konversi derajat ke radian
        const toRadians = (angle: number) => (angle * Math.PI) / 180;
        return [
        { x, y }, // Pusat
        { x: x + r, y }, // Titik pada radius (asumsi sudut 0 derajat)
        {
            x: x + r * Math.cos(toRadians(startAngle)),
            y: y + r * Math.sin(toRadians(startAngle))
        },
        {
            x: x + r * Math.cos(toRadians(endAngle)),
            y: y + r * Math.sin(toRadians(endAngle))
        }
        ];
    }

    moveHandle(index: number, x: number, y: number) {
        const [cx, cy, r, start, end] = this.data.args;
        switch (index) {
            case 0:
                this.data.args[0] = x;
                this.data.args[1] = y;
                break;
            case 1:
                this.data.args[2] = Math.hypot(x - cx, y - cy);
                break;
            case 2:
                this.data.args[3] = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
                break;
            case 3:
                this.data.args[4] = Math.atan2(y - cy, x - cx) * 180 / Math.PI;
                break;
        }
    }
}
  
class Triangle {
    constructor(public data: TriangleCall) {}

    static from(data: TriangleCall): Triangle {
        return new Triangle(data);
    }

    getHandle(): { x: number; y: number }[] {
        const [x0, y0, x1, y1, x2, y2] = this.data.args;
        return [
        { x: x0, y: y0 },
        { x: x1, y: y1 },
        { x: x2, y: y2 }
        ];
    }

    moveHandle(index: number, x: number, y: number) {
        if (index < 0 || index > 2) return;
        this.data.args[index * 2] = x;
        this.data.args[index * 2 + 1] = y;
        this.updateBound()
    }

    updateBound() {
        const [x0, y0, x1, y1, x2, y2] = this.data.args;
        const x = Math.min(x0, x1, x2);
        const y = Math.min(y0, y1, y2);
        const w = Math.max(x0, x1, x2) - x;
        const h = Math.max(y0, y1, y2) - y;
        this.data.bound = { x, y, w, h };
    }
}
  
class Frame {
    constructor(public data: FrameCall) {}

    static from(data: FrameCall): Frame {
        return new Frame(data);
    }

    getHandle(): { x: number; y: number }[] {
        const [x, y, w, h] = this.data.args;
        return [
            { x, y },           // Top-left
            { x: x + w, y },    // Top-right
            { x: x + w, y: y + h }, // Bottom-right
            { x, y: y + h }     // Bottom-left
        ];
    }

    moveHandle(index: number, x: number, y: number) {
        const [ox, oy, ow, oh] = this.data.args;
        switch (index) {
        case 0: // top-left
            this.data.args = [x, y, ox + ow - x, oy + oh - y];
            break;
        case 1: // top-right
            this.data.args = [ox, y, x - ox, oy + oh - y];
            break;
        case 2: // bottom-right
            this.data.args = [ox, oy, x - ox, y - oy];
            break;
        case 3: // bottom-left
            this.data.args = [x, oy, ox + ow - x, y - oy];
            break;
        }
        this.updateBound()
    }

    updateBound() {
        const [x, y, w, h] = this.data.args;
        this.data.bound = { x, y, w, h };
    }
}

class Box extends Frame {
    static from(data: FrameCall): Box {
        return new Box(data);
    }
}
  
  
export type LayerWrapper =
    | Line
    | Str
    | Circle
    | Disc
    | Ellipse
    | FilledEllipse
    | Arc
    | Triangle
    | Frame
    | Box;

export class LayerFactory {
    static from(data: LayerCall): LayerWrapper {
        switch (data.f) {
            case 'drawLine': return Line.from(data);
            case 'drawStr': return Str.from(data);
            case 'drawCircle': return Circle.from(data);
            case 'drawDisc': return Disc.from(data);
            case 'drawEllipse': return Ellipse.from(data);
            case 'drawFilledEllipse': return FilledEllipse.from(data);
            case 'drawArc': return Arc.from(data);
            case 'drawTriangle': return Triangle.from(data);
            case 'drawFrame': return Frame.from(data);
            case 'drawBox': return Box.from(data);
        default:
            throw new Error(`Unknown draw type: ${(data as any).f}`);
        }
    }
}
  

/*
    usage:
    const rawCalls: LayerCall[] = [
        { f: 'line', args: [0, 0, 10, 10], lineNo: 1, columnNo: 1 },
        { f: 'str', args: [5, 5, 'Hello'], lineNo: 2, columnNo: 3 }
    ];
    
    //* Bungkus semua
    const wrappedCalls = rawCalls.map(CallFactory.from);
    
    //* Gunakan method tambahan
    wrappedCalls.forEach(wrapped => {
        wrapped.move(10, 10); // perintah yang sama bisa digunakan pada semua jenis
        console.log(wrapped.toString());
    });
    
    console.log(rawCalls);
    //* 🎉 Data mentah telah berubah karena referensinya sama!
*/
  
/*  
export interface Layer {
    // Function name
    f: | 'drawLine' | 'drawCircle' | 'drawDisc' | 'drawEllipse' | 'drawFilledEllipse';
    l: number;  // Line Number. (1 based, so the first line = 1, not zero)
    c: number;  // Column Number. the position of char 'd' of 'u8g2.drawCircle (1 based)
    args: [     // actual values received by function call.
        number,     // x 
        number,     // y
        number |    // radius x
            string, // text
        number?,    // radius y
        number?,    // arc start    
        number?,    // arc end    
    ],
    bound?: {
        x:number,
        y:number,
        w:number,
        h:number
    }
}*/