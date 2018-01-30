import v0 from './api/v0/index.js'

export default (function() {
  const APIs = {
    'v0': v0,
  }

  function widget(apiVersion, setupFunction) {
    let version

    // Make sure apiVersion is a string and the version exists.

    if (typeof apiVersion !== 'string' || apiVersion.toLowerCase()[0] !== 'v') {
      throw new Error('First parameter should be the Widget API version in the vX format: v0, v1, v2, etc.')
    }

    version = apiVersion.toLowerCase();

    if (!APIs[version]) {
      throw new Error(`API version ${apiVersion} does not exist. Available: ${Object.keys(APIs).join(', ')}`)
    }

    // Make sure the setupFunction is a function.

    if (typeof setupFunction !== 'function') {
      throw new Error('Second parameter should be a function that sets up the widget: function(widget) { ... }')
    }

    const API = APIs[version]

    // The API is called as a function to create a brand new copy for each widget.
    // Each widget will have an ID from the database - for now using 123
    setupFunction.call(null, new API('123'))
  }

  return { widget }
})()
