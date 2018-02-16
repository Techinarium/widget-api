import Dash from './main.js'

window.Dash = Dash.public
const { on } = Dash.private

const widgets = []

on('widgetCreated', widget => {
  console.log('created', widget)
  const el = document.getElementById('widget')
  el.appendChild(widget.state.layouts[0].render())
})
