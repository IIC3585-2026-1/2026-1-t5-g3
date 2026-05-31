import { mount } from 'svelte'
import '@mybooks/shared/styles/app.css'
import App from './App.svelte'

mount(App, {
  target: document.getElementById('app')!,
})
