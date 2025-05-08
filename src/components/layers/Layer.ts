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