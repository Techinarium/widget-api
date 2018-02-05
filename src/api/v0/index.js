import _data from './data.js'
import _element from './element.js'
import _layout from './layout.js'
import _events from './events.js'

export default function() {
  // Mutable state object shared by the API functions
  const state = {
    dom: null, // Root node resulting from layout.render()
    root: null, // Container that 'dom' gets attached to
    size: null,
    data: {},
    layouts: []
  }

  const events = _events(state)
  // Rollup doesn't like the word 'data' alone as a function name,
  // so these all have an underscore prepended.
  const data = _data(state, events)
  const element = _element(state, events)

  const { layout, setLayout } = _layout(state, events)

  return {
    private: {
      // This is where the internal lifecycle triggers and things might go
      // Stuff that's used by Dash behind the scenes
      get state() {
        return state
      },
      sizes() {
        return state.layouts.map(l => l.size)
      },
      on(event, func) {
        events.on(event, func)
      },
      init(root) {
        state.size = '2x2'
        state.root = root
        // Render
      }
    },
    public: {
      get dom() {
        return state.dom
      },
      data,
      element,
      layout,
      setLayout,
    },
  }
}
