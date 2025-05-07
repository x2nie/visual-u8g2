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
        this.env.editor.getFunctionParameter = this.getFunctionParameter.bind(this);

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

    getFunctionParameter(lineNo, colNo, argsCount){
        const model = this.editor.getModel() 
        let code = model.getLineContent(lineNo);
        let result
        while(true && lineNo < model.getLineCount()){
            result = extractFunctionParams(code, colNo)
            if(result.length==argsCount)
                break;
            code += model.getLineContent(++lineNo)
        }
        return result;
    }

    editorChange(ev){
        this.env.editor.content = this.editor.getValue()
    }
}

function extractFunctionParams(code, startColumn) {
    const start = code.indexOf('(', startColumn);
    // const end = code.lastIndexOf(')');
    let end = code.indexOf(';', start);
    while (code[end] != ')' && end > 0)
        end--;
    if (start === -1 || end < 0 || end <= start) return [];

    const paramStr = code.slice(start + 1, end);
    const params = [];

    let current = '';
    let parenDepth = 0;

    for (let i = 0; i < paramStr.length; i++) {
        const char = paramStr[i];

        if (char === ',' && parenDepth === 0) {
        //   params.push(current.trim());
        params.push(current);
        current = '';
        } else {
        if (char === '(') parenDepth++;
        else if (char === ')') parenDepth--;
        current += char;
        }
    }

  //   if (current.trim()) params.push(current.trim());
    if (current) params.push(current);

    return params;
}