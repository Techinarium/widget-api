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

    // The API is called as a function to create a brand new copy for each widget.
    // Each widget will have an ID from the database - for now using 123
    const api = new (APIs[version])('123')

    // TODO: Make the private portion available to the behind-the-scenes dashboard code

    // Send off the public portion to the caller.
    setupFunction.call(null, api.public)

    // HACK: Do this better
    const el = api.private.state.layouts[0].render()
    return el;
  }

  return { widget }
})()
