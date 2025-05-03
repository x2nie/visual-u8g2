import * as monaco from 'monaco-editor';
console.log(monaco)

// Clone definisi bahasa C++ dan tambahkan fitur Arduino
// function setupInoLanguage() {
  // Dapatkan definisi C++ yang sudah ada
  const cppLang = monaco.languages.getLanguages().find(l => l.id === 'cpp');
  const cpp = await cppLang.loader()
  const cppTokens = cpp.language;
//   cpp.tokenizer.root = [
//     // Match object.method() pattern
//     [/([a-zA-Z_]\w*)(\.)([a-zA-Z_]\w*)/, ['object.cpp', 'dot.cpp', 'method.cpp']],
//     , ...cpp.tokenizer.root]
//   debugger
  // Register bahasa baru 'ino' (Arduino)
  monaco.languages.register({ id: 'ino' });
  
  // Clone token provider C++
//   const cppTokens = monaco.languages.getMonarchTokensProvider('cpp');
  
  // Extend dengan aturan khusus Arduino
  monaco.languages.setMonarchTokensProvider('ino', {
    ...cppTokens,
    keywords: [
      ...cppTokens.keywords,
      'pinMode', 'digitalWrite', 'digitalRead', 'analogRead', 
      'analogWrite', 'delay', 'millis', 'micros', 'Serial',
      'setup', 'loop' // Tambahkan keyword khusus Arduino
    ],
    tokenizer: {
      ...cppTokens.tokenizer,
      root: [
        // Tambahkan rule khusus untuk object.method (warna berbeda)
        [/([a-zA-Z_]\w*)(\.)([a-zA-Z_]\w*)/, ['object.ino', 'delimiter.ino', 'method.ino']],
        ...cppTokens.tokenizer.root
      ]
    }
  });
// }
