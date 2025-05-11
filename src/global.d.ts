
declare module "*.bdf" {
    const content: string;
    export default content;
}

declare module "*.raw.cpp" {
    const content: string;
    export default content;
}

declare module "bdf-canvas" {
    interface Glyph  {
        BITMAP: any[]
        DWIDTH: {
            x: number;
            y: number;
        }
    }
    export class BDFFont {
        SIZE : {
            size:number;
            xres:number;
            yres:number;
        }
        CHARS : number;
        DWIDTH: {
            x: number;
            y: number;
        }
        properties: {[key:string]:number};
        glyphs: {[key:string]:Glyph}

        //? helpers, for speedup
        _MaxCharWidth: number;
        
        constructor(font: string);

        drawChar(ctx: CanvasRenderingContext2D, c: number, bx: number, by: number, t?: any): any;

        drawEdgeText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, t?: any): any;

        drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, t?: any): any;

        getGlyphOf(c: number): any;

        init(bdf: any): void;

        measureText(text: string): {width:number; height:number};

        parse(bdf: any): void;

    }
}