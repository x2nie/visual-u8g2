/**
 * Convert parts of the c++ language to javascript.
 *
 * @param code The pseudo C++ code to be transpiled
 */
export const transpile = (code: string) => {
    let transpiled = code;

    let lines = transpiled.split("\n");

    lines = lines.map(line => {
        if (line.startsWith("void") || line.startsWith("uint")) {
            line = line.replace(/^void /g, "function ");
            line = line.replace(/\(void\)/g, "()");
            line = line.replace(/^u?int((8|16|32)_t)? /g, "function ");

            line = line.replace(/U8G2 u8g2/g, "u8g2");
            line = line.replace(/u?int((8|16|32)_t)? /g, "");
            line = line.replace(/float /g, "");
            line = line.replace(/double /g, "");
            line = line.replace(/String /g, "");
            line = line.replace(/bool /g, "");
            line = line.replace(/const char \*/g, "");
        } else {
            line = line.replace(/u?int((8|16|32)_t)? /g, "var ");
            line = line.replace(/float /g, "var ");
            line = line.replace(/double /g, "var ");
            line = line.replace(/bool /g, "var ");

        }
        // line = line.replace(/(U8G2_[a-zA-Z0-9_-]*)/g, "\"$1\"");
        line = line.replace(/_tf/g, "");
        line = line.replace(/(u8g2_font_[a-zA-Z0-9_-]*)/g, "\"$1\"");
        line = line.replace(/\.length\(\)/g, ".length");
        line = line.replace(/sin\(/g, "Math.sin(");
        line = line.replace(/cos\(/g, "Math.cos(");
        line = line.replace(/PI/g, "Math.PI");
        line = line.replace(/\.c_str\(\)/g, "");

        return line;
    });

    // console.log(lines.join("\n"));
    return lines.join("\n");
};
