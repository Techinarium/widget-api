export default function(state) {
  function _applyStyles(el, styles) {
    for (const prop in styles) {
      const name = prop.replace(/([a-z\d])([A-Z])/, '$1-$2').toLowerCase()

      console.log('style: ', name, styles[prop])

      el.style[name] = styles[prop]
    }
  }

  function _attachHandler(el, name, handler) {
    // Handle properties starting with 'on'

    const eventName = name.slice(2).toLowerCase()

    console.log(eventName)

    el.addEventListener(eventName, handler)
  }

  function _applyAttribute(el, name, value) {
    switch(name.toLowerCase()) {
    default:
      el.setAttribute(name, value)
      break
    }
  }

  function _applyProps(el, props) {
    for (const key in props) {
      const k = key.toLowerCase()

      if (/^on/.test(k)) {
        // Is an event handler
        _attachHandler(el, key, props[key])
      } else if (k === 'styles') {
        _applyStyles(el, props[key])
      } else {
        // Treat as a regular attribute.
        _applyAttribute(el, key, props[key])
      }
    }
  }

  function _el(tag, props) {
    // Create DOM nodes.
    const el = document.createElement(tag)
    if (props) {
      _applyProps(el, props)
    }
    return el
  }

  function _base(props) {
    // Handle all the common element setup

  }

  function textbox(props, children) {
    console.log('Instantiating a textbox element')
    const el = _el('textarea')

    _applyStyles(el, {
      position: 'relative',
      border: 0,
      resize: 'none',
    })

    _applyProps(el, props)

    if (typeof children === 'string') {
      el.value = children
    }

    return el
  }

  function text() {
    console.log('Instantiating a text element')
  }

  return {
    text,
    textbox
  }
}
