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

type LayerCall = LineCall | StrCall;


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

    toString(): string {
        const [x, y, text] = this.data.args;
        return `Text "${text}" at (${x}, ${y})`;
    }
}
  
class CallFactory {
    static from(data: LayerCall) {
        switch (data.f) {
        case 'line':
            return Line.from(data);
        case 'str':
            return Str.from(data);
        default:
            throw new Error(`Unknown call type: ${(data as any).f}`);
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