/**
 * Author: x2nie - Fathony L
 * Date create: 2025-05-02
 * Purpose: getting method calls of u8g2 object by eval but later parse the line 
 * License: LGPL or Apache 2.0 or MPL 2.1 (Mozilla Public License)
 */

const EVAL_CALLS = [];
/**
 * 
 * @param {string} f Function Name being callled
 * @param {number} l Line Number
 * @param {Array} args Arguments passed to function
 */
function add(f, lineCol, args){
    const [l,c] = lineCol;
    // console.log(`${f} dipanggil di baris #${l}:${c} dengan params: ${[...args]}`);
    EVAL_CALLS.push({f, l, c, args})
}

export const _U8G2_EVAL = {
    drawLine: function(...args) {
        // const lineNumber = getLinenumber()
        // console.log(`drawLine dipanggil di baris ${lineNumber} dengan params: ${args}`);
        add('drawLine', getLinenumber(), args)
    },
    
    drawStr: function(...args) {
        add('drawStr', getLinenumber(), args)
    },

    drawCircle: function(x0, y0, rad, ...opt) {
        add('drawCircle', getLinenumber(), [x0, y0, rad, ...opt])
    },
    drawDisc: function(x0, y0, rad, ...opt) {
        add('drawDisc', getLinenumber(), [x0, y0, rad, ...opt])
    },
    drawEllipse: function(x0, y0, rx, ry, ...opt) {
        add('drawEllipse', getLinenumber(), [x0, y0, rx, ry, ...opt])
    },
    drawXBMP: function(x0, y0, w, h, txt) {
        add('drawXBMP', getLinenumber(), [x0, y0, w, h, txt])
    },
    drawXBM: function(x0, y0, w, h, txt) {
        add('drawXBM', getLinenumber(), [x0, y0, w, h, txt])
    },
    setFont: function(fontName) {
        // add('setFont', getLinenumber(), [fontName])
    },
    clear: ()=>{},
    begin: ()=>{},
    setDrawColor: ()=>{},
}

const U8G2_DRAW_UPPER_RIGHT = 0x01;
const U8G2_DRAW_UPPER_LEFT =  0x02;
const U8G2_DRAW_LOWER_LEFT = 0x04;
const U8G2_DRAW_LOWER_RIGHT =  0x08;
const U8G2_DRAW_ALL = (U8G2_DRAW_UPPER_RIGHT|U8G2_DRAW_UPPER_LEFT|U8G2_DRAW_LOWER_RIGHT|U8G2_DRAW_LOWER_LEFT);

export function parse_ino(code){
    EVAL_CALLS.splice(0, EVAL_CALLS.length)
    const u8g2 = _U8G2_EVAL //* DO NOT REMOVE THIS LINE. requires by eval.
    eval(code)
    return EVAL_CALLS
}

function getLinenumber() {
    const error = new Error()
    const stack = error.stack.replace(/Error[\n\s]*/,'').trim()
    // console.log(stack)
    // const stackLine = stack.split('\n').pop(); // Ambil baris pemanggilan
    const stackLine = stack.split('\n')[2]; // Ambil baris pemanggilan
    const [_, lineNum, colNum] = stackLine.match(/>[eval ]*:(\d+):(\d+)/); // Ekstrak nomor baris
    return [parseInt(lineNum), parseInt(colNum)]
}

