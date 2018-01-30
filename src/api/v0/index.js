import _data from './data.js'
import _element from './element.js'
import _layout from './layout.js'

export default function(id) {
  // Mutable state object shared by the API functions
  const state = {
    id,
    dom: null,
    data: {},
  }

  // Rollup doesn't like the word 'data' alone as a function name,
  // so these all have an underscore prepended.
  const data = _data(state)
  const element = _element(state)

  const { layout, setLayout } = _layout(state)

  return {
    get dom() {
      return state.dom
    },
    data,
    element,
    layout,
    setLayout,
  }
}
