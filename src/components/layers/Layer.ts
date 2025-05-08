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
    } & CallCommon;

type CircleCall = {
    f: 'drawCircle' | 'drawDisc';
    args: [number, number, number]; // x, y, radius
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

type LayerCall = LineCall | StrCall | CircleCall | /* DiscCall | */ EllipseCall | /* FilledEllipseCall | */ ArcCall;


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
    getHandles(): { x: number; y: number }[] {
        const [x, y, x2, y2] = this.data.args;
        return [
        { x, y },           // Pusat
        { x: x2, y: y2 }     // Titik pada radius
        ];
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

    getHandles(): { x: number; y: number }[] {
        const [x, y, r] = this.data.args;
        return [
            { x, y },           // Pusat
            { x: x + r, y }     // Titik pada radius
        ];
    }

    moveHandle(index: number, x: number, y: number) {
        switch (index) {
            case 0:
                const [_, __, r0] = this.data.args;
                this.data.args = [x, y, r0];
                break;
            case 1:
                const [cx, cy, _r] = this.data.args;
                this.data.args[2] = x - cx;
                break;
        }
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

    getHandles(): { x: number; y: number }[] {
        const [x, y, rx, ry] = this.data.args;
        return [
        { x, y },               // Pusat
        { x: x + rx, y },       // Titik pada radius x
        { x, y: y + ry }        // Titik pada radius y
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
  
  
type LayerWrapper = Line | Str | Circle | Disc | Ellipse | FilledEllipse | Arc;

class LayerFactory {
    static from(data: LayerCall): LayerWrapper {
        switch (data.f) {
        case 'drawLine':
            return Line.from(data);
        case 'drawStr':
            return Str.from(data);
        case 'drawCircle':
            return Circle.from(data);
        case 'drawDisc':
            return Disc.from(data);
        case 'drawEllipse':
            return Ellipse.from(data);
        case 'drawFilledEllipse':
            return FilledEllipse.from(data);
        case 'drawArc':
            return Arc.from(data);
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
}