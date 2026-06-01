import { mount } from 'svelte'
import '../../../packages/shared/src/styles/app.css'
import App from './App.svelte'

mount(App, {
  target: document.getElementById('app')!,
})
