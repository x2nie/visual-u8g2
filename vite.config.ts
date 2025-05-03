import { defineConfig } from 'vite';
import * as vme from 'vite-plugin-monaco-editor';
//@ts-ignore
const monacoEditorPlugin = typeof vme.default === 'function'? vme.default : vme.default.default;

export default defineConfig({
    plugins: [
        monacoEditorPlugin({
            languageWorkers: ['editorWorkerService'], // sesuaikan dengan kebutuhan
            customWorkers: [
              {
                label: 'json',
                entry: 'monaco-editor/esm/vs/language/json/json.worker'
              }
            ]
        })
    ],
});