import { loadFile, mount, whenReady } from "@odoo/owl";
import App from './App'

whenReady(async function () {

  const [templates] = await Promise.all([
    loadFile("templates.xml"),
  ])

  const env = {}

  mount(App, document.body, { 
      env, 
      templates, 
      // 'debug': true,
      //props: {...}, templates: "..."}
  });
  
})
