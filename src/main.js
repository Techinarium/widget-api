import v0 from './api/v0/index.js'
import _events from './api/v0/events.js'

const APIs = {
  'v0': v0,
}

/*

We want to:
- Load a widget and its code from the database
- Execute the widget's code, which sets up the widget
- Hook the widget setup and restore any saved state
- Create a grid element for the widget
- run the widget's setLayout function, which
  calls render() on whichever layout is being set.
- Take the result of render() and attach to the grid element
*/

// The public Dash.* API globally available to Dash developers.
export default (function() {

  const events = _events()

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
    const api = new (APIs[version])()

    // TODO: Make the private portion available to the behind-the-scenes dashboard code

    // Send off the public portion to the caller.
    setupFunction.call(null, api.public)

    events.emit('widgetCreated', api.private)
  }

  return {
    private: {
      on(event, func) {
        events.on(event, func)
      }
    },
    public: { widget }
  }
})()
