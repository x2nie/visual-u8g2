// EditorComponent.js
import { Component, onMounted, useEffect, useRef, useState } from "@odoo/owl";
import * as monaco from "monaco-editor";
import * as esprima from 'esprima';
import './themes'
import './lang_ino'
import { transpile } from "../../util/cpp2javascript";


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
        const [firstLine,firstCol,lastLine] = lineNums;
        return {
            range: new monaco.Range(firstLine, firstCol, lastLine, model.getLineMaxColumn(lastLine)),
            text: texts.join('\n'),
            forceMoveMarkers: true
        }
        })
        model.pushEditOperations([], edits, () => null);

    }

    getFunctionParameter(lineNo, colNo){
        const model = this.editor.getModel() 
        let line = model.getLineContent(lineNo);
        line = line.slice(colNo-1);

        let code = line
        let end = line.indexOf(';')
        while(end == -1){
            line = model.getLineContent(++lineNo)
            end = line.indexOf(';')
            code += end >=0? line.slice(0, end) : line;
        }
        let result = extractFunctionParams(code)
        // let result
        // while(true && lineNo < model.getLineCount()){
        //     result = extractFunctionParams(code, colNo)
        //     if(result.length==argsCount)
        //         break;
        //     code += model.getLineContent(++lineNo)
        // }
        return result;
    }

    editorChange(ev){
        // this.env.editor.content = this.editor.getValue()
        // return
        const model = this.editor.getModel() 
        let code = model.getValue();
        code = transpile(code)
        const error = checkSyntax(code);
        if (error) {
            console.log(error)
            monaco.editor.setModelMarkers(model, 'owner', [{
                startLineNumber: error.line,
                startColumn: error.column,
                endLineNumber: error.line,
                endColumn: error.column + 1,
                message: error.message,
                severity: monaco.MarkerSeverity.Error
            }]);
        } else {
            // clear markers
            monaco.editor.removeAllMarkers('owner');
            this.env.editor.content = this.editor.getValue()
        }
    }
}

function checkSyntax(code) {
    try {
      esprima.parseScript(code, { tolerant: false, loc: true });
      return null; // tidak ada error
    } catch (e) {
        // console.log(e);
        return {
            message: e.message,
            line: e.lineNumber,
            column: e.column
        };
    }
}

function extractFunctionParams(code, startColumn=0) {
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
            // params.push(current.trim());
            params.push(current);
            current = '';
        } else {
            if (char === '(') 
                parenDepth++;
            else if (char === ')') 
                parenDepth--;
            current += char;
        }
    }

    if (current) params.push(current);

    return params;
}