import { loadFile, mount, reactive, whenReady } from "@odoo/owl";
import App from './App'

whenReady(async function () {

  const [templates, cpp_content] = await Promise.all([
    loadFile("templates.xml"),

    // loadFile("examples/intro.raw.cpp"),
    loadFile("examples/dev1.cpp"),
  ])

  const env = {
    editor: reactive({
      content: cpp_content,
    })
  }

  mount(App, document.body, { 
      env, 
      templates, 
      // 'debug': true,
      //props: {...}, templates: "..."}
  });
  
})
