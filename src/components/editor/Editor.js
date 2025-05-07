// EditorComponent.js
import { Component, onMounted, useEffect, useRef, useState } from "@odoo/owl";
import * as monaco from "monaco-editor";
import './themes'
import './lang_ino'


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
