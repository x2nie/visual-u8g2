import { Component, xml } from "@odoo/owl";
import { transpile } from "../../util/cpp2javascript";
import { U8G2_EVAL, EVAL_CALLS } from "./u8g2_eval";

const CALL_LOOP = '; try{ loop(); } catch(err) {console.log("error-evaluate-loop:"+err.message);}'
export class Parser extends Component{

    btnClick(){
        let code = this.env.editor.content;
        code = transpile(code)
        console.log(code)
        const u8g2 = U8G2_EVAL; //* DO NOT REMOVE THIS LINE. requires by eval.
        eval(code + CALL_LOOP)
        for(const d of EVAL_CALLS){
            console.log(d)
        }

    }
    /*btnClick(){
        const code = this.env.editor.content;
        const regex = /u8g2\.\w+[^;]+;/g;
        let m;

        while ((m = regex.exec(code)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
            });
        }
    }*/
}

Parser.template = xml`
    <button t-on-click="btnClick">Parse!</button>
`