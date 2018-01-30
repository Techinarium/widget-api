export default function(state) {

  if (!state.data) state.data = {}

  function _save() {
    localStorage.setItem(`widget_${state.id}_data`, JSON.stringify(state.data))
  }

  function _load() {
    state.data = JSON.parse(localStorage.getItem(`widget_${state.id}_data`) || '{}')
  }

  // Try to fetch widget data on initialization.
  _load()

  function get(property) {
    if (Array.isArray(property)) {
      // Take an array, return an array.
      return property.map(p => state.data[p])
    } else if (typeof property === 'string') {
      // Take a string, return a value.
      return state.data[property]
    } else {
      throw new Error('data.get() takes either an array or a string as the first parameter. Received ' + (typeof parameter))
    }
  }

  function set(property, value) {
    // Takes a name and a value, or an object of names and values to update.

    if (typeof property === 'object') {
      if (typeof value !== 'undefined') {
        throw new Error('data.set() takes either a string and a value, or an object. Received an object as the first parameter and a ' + (typeof value) + ' as the second.')
      }
      let props = property

      // Update by object.
      for (const key in props) {
        state.data[key] = props[key]
      }

    } else if (typeof property === 'string') {
      // Update by value.
      state.data[property] = value

    } else {
      throw new Error('data.set() takes either a string or an object as the first parameter. Received ' + (typeof parameter))
    }

    _save() // Save after every set.
  }

  return { get, set }
}
