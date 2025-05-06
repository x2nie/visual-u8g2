import * as monaco from 'monaco-editor';
// console.log(monaco)

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
      'setup', 'loop', // Tambahkan keyword khusus Arduino
      'U8G2', 'uint8_t', 'uint16_t'
    ],
    tokenizer: {
      ...cppTokens.tokenizer,
      root: [
        // Rule untuk tipe parameter fungsi (baru ditambahkan)
        // [/(\w+)(\s+)(\w+)(\s*)(\()/, 
        //   ['type.parameter.ino', 'white', 'identifier.ino', 'white', 'delimiter.parenthesis.ino']],
        // Rule khusus untuk tipe parameter fungsi
        // [/(\w+)(\s+)(\w+)(\s*)(,?)(\s*)/, 
        //   [
        //     // 'type.parameter.ino',  // Tipe (int, float, etc)
        //     'type',  // Tipe (int, float, etc)
        //     'white',               // Spasi
        //     'identifier.parameter.ino', // Nama parameter (x, y)
        //     'white',               // Spasi setelah nama
        //     'delimiter.parameter.ino', // Koma (jika ada)
        //     'white'                // Spasi setelah koma
        //   ]
        // ],

        // Rule KHUSUS untuk parameter fungsi (menggunakan lookahead '(')
        // [/(\w+)(\s+)(\w+)(?=\s*[,)]|\s*\()/,
        //   ['type', 'white', 'identifier.parameter']
        // ],

        [/\b([\w:<>]+(?:\s*[*&])?)(\s+)(\w+)(?=\s*(?:,|\)))/,
          ['type.parameter', 'white', 'identifier.parameter']
        ],

        // Tambahkan rule khusus untuk object.method (warna berbeda)
        [/([a-zA-Z_]\w*)(\.)([a-zA-Z_]\w*)/, ['object.ino', 'delimiter.ino', 'method.ino']],
        ...cppTokens.tokenizer.root,

        // Rule KHUSUS untuk parameter fungsi (menggunakan lookahead '(')
        [/(\w+)(\s+)(\w+)(?=\s*[,)]|\s*\()/,
          ['type.parameter', 'white', 'identifier.parameter']
        ],
      ]
    }
  });
// }
