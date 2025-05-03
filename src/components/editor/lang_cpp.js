import * as monaco from "monaco-editor";

// Extend C++ syntax highlighting
monaco.languages.setMonarchTokensProvider('cpp', {
    defaultToken: '',
    tokenPostfix: '.cpp',
    
    tokenizer: {
      root: [
        // Match object.method() pattern
        [/([a-zA-Z_]\w*)(\.)([a-zA-Z_]\w*)/, ['object.cpp', 'dot.cpp', 'method.cpp']],
        
        // Default rules
        [/[a-zA-Z_]\w*/, { cases: { 
          '@keywords': 'keyword',
          '@default': 'identifier' 
        }}],
        { include: '@whitespace' },
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, 'operator'],
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],
        [/[;,.]/, 'delimiter'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string']
      ],
      
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment']
      ],
      
      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        ["\\*/", 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],
      
      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ]
    },
    
    keywords: [
      'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor',
      'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t',
      'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'const_cast',
      'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default',
      'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit',
      'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
      'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not',
      'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected',
      'public', 'register', 'reinterpret_cast', 'requires', 'return', 'short',
      'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct',
      'switch', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
      'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual',
      'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
    ]
  });
  
  // Export function to initialize editor
//   export function initEditor(container, initialCode) {
//     const editor = monaco.editor.create(container, {
//       value: initialCode,
//       language: 'cpp',
//       theme: 'tomorrow-night-custom',
//       automaticLayout: true
//     });
//     return editor;
//   }