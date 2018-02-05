export default function(state) {

  if (!state.layouts) state.layouts = []

  function layout(conf) {
    // Validate
    if (typeof conf === 'object' && !Array.isArray(conf)) {
      // It's the right type of thing. Make sure it has the right properties.

      if (typeof conf.name !== 'string') {
        // name must exist and be a string
      }

      if (typeof conf.size !== 'string' && !Array.isArray(conf.size)) {
        // size must be a string or array
      }

      if (typeof conf.render !== 'function') {
        // must have a render function
      }

      state.layouts.push(conf) // Everything checks out

    } else {
      if (!conf) {
        throw new Error('api.layout() was called without any layout object.')
      } else {
        throw new Error('api.layout() takes a layout object as the first parameter. Received ' + (typeof conf))
      }
    }
  }

  function setLayout(name, transition) {
    console.log('Setting layout to ' + name)

    // Render the layout for the current size, save it as state.dom and append it to state.root
  }

  return { layout, setLayout }
}
