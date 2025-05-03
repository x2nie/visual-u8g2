import * as monaco from "monaco-editor";

// Definisikan tema TomorrowNight
monaco.editor.defineTheme('tomorrow-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'comment', foreground: '#969896', fontStyle: 'italic' },
        { token: 'keyword', foreground: '#c397d8' },
        { token: 'number', foreground: '#e78c45' },
        { token: 'string', foreground: '#b9ca4a' },
        { token: 'type', foreground: '#7aa6da' },
        { token: 'delimiter', foreground: '#eaeaea' },
        { token: 'operator', foreground: '#eaeaea' },
        // Tambahkan aturan token lainnya sesuai kebutuhan

        // Aturan khusus untuk instance (u8g2)
        { token: 'variable.instance.cpp', foreground: '#7aa6da' }, // Warna biru seperti tipe
        { token: 'object.ino', foreground: '#7aa6da' }, // Warna biru seperti tipe
        // { token: 'method.ino', foreground: '#b9ca4a' }, // Warna hijau seperti string

        // Warna baru untuk tipe parameter
      { token: 'type.parameter', foreground: '#607D8B' },  // #455A64  #d19a66 Oranye muda
      { token: 'identifier.ino', foreground: '#abb2bf' },        // Abu-abu muda (nama parameter)
      { token: 'delimiter.parenthesis.ino', foreground: '#e06c75' }, // Merah muda untuk kurung



    ],
    colors: {
      'editor.background': '#1d1f21',
      'editor.foreground': '#c5c8c6',
      'editor.lineHighlightBackground': '#282a2e',
      'editorLineNumber.foreground': '#969896',
      'editor.selectionBackground': '#373b41',
      'editor.inactiveSelectionBackground': '#282a2e',
    }
})
  