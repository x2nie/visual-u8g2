// EditorComponent.js
import { Component, onMounted, useEffect, useRef, useState } from "@odoo/owl";
import * as monaco from "monaco-editor";
import './themes'
import './lang_ino'


const SAMPLE_CPP = `void draw(U8G2 u8g2) {
    // WARNING: ⚠️ DO NOT PASTE CODE FROM OTHERS INTO THIS WINDOW ⚠️

    u8g2.setDrawColor(1);
    u8g2.drawPixel(1, 0);
    u8g2.drawPixel(3, 0);
    u8g2.setFont(u8g2_font_5x8);
    u8g2.drawStr(1,16,"Hi, this editor supports");
    u8g2.drawStr(1,32,"a tiny bit of C++ transp.");
    u8g2.drawStr(1,48,"but it is infact javascript");
    // this should help you copy and paste the "c++" code to the Arduino IDE
    // Datatypes get translated to "var": (u)int(8,16,32)(_t), float, double

    // this code gets eval(..)'ed in the background with an fake u8g2 instance mapped to the HTML5 Canvas above
}`

const SAMPLE_CPP0 = `void main()
{
	int answer = 6 * 7;
	printf("answer = %d", answer);
}`;

export class Editor extends Component {
  static template = "EditorComponent";

  setup() {
    this.sim = useState(this.env.sim);
    this.editorRef = useRef("editorContainer");
    this.env.editor.editLine = this.editLine.bind(this);

    useEffect((el) => {
      this.editor = monaco.editor.create(el, {
        // value: "// Tulis kode kamu di sini\n"+SAMPLE_CPP,
        value: this.env.editor.content,
        // language: "cpp",
        language: "ino",
        // theme: "vs-dark",
        theme: "tomorrow-night",
        automaticLayout: true,
      });
      this.editor.onDidChangeModelContent(
        this.editorChange.bind(this)
      )
    }, 
    () => [this.editorRef.el]);
  }

  async editLine(tasks) {
    const model = this.editor.getModel();
    const edits = tasks.map(([lineNums, texts]) => {
      const [firstLine,lastLine] = lineNums;
      return {
        range: new monaco.Range(firstLine, 1, lastLine, model.getLineMaxColumn(lastLine)),
        text: texts.join('\n'),
        forceMoveMarkers: true
      }
    })
    model.pushEditOperations([], edits, () => null);

  }
  editorChange(ev){
    this.env.editor.content = this.editor.getValue()
  }
}
