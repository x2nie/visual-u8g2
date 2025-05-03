export const EVAL_CALLS = []
function add(name, lineNumber, args){
    console.log(`${name} dipanggil di baris ${lineNumber} dengan params: ${[...args]}`);
    EVAL_CALLS.push({name, lineNumber, args})
}

export const U8G2_EVAL = {
    drawLine: function(...args) {
        // const lineNumber = getLinenumber()
        // console.log(`drawLine dipanggil di baris ${lineNumber} dengan params: ${args}`);
        add('drawLine', getLinenumber(), args)
    },
    
    drawStr: function(...args) {
        add('drawStr', getLinenumber(), args)
        // const lineNumber = getLinenumber()
        // console.log(`drawStr dipanggil di baris ${lineNumber} dengan params: ${args}`);
    }
}

function getLinenumber() {
    const error = new Error()
    const stack = error.stack.replace(/Error[\n\s]*/,'').trim()
    // console.log(stack)
    // const stackLine = stack.split('\n').pop(); // Ambil baris pemanggilan
    const stackLine = stack.split('\n')[2]; // Ambil baris pemanggilan
    const lineNumber = stackLine.match(/>:(\d+):\d+/)[1]; // Ekstrak nomor baris
    return lineNumber
}