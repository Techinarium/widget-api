// Test Dash.widget

import Dash from './main.js';

describe('Dash.widget', () => {
  it('is a function', () => {
    expect(typeof Dash.widget).toBe('function')
  })

  it('throws an error when first parameter is not a string', () => {
    expect(() => {
      Dash.widget(1, function() {})
    }).toThrow()
  })

  it('throws an error when second parameter is not a function', () => {
    expect(() => {
      Dash.widget('v0', 'taco')
    }).toThrow()
  })

  it('throws an error when nonexistent API version is specified', () => {
    expect(() => {
      Dash.widget('v999999', function() {})
    }).toThrow()
  })

  it('runs the setup function', () => {
    let pass = false

    Dash.widget('v0', function(widget) {
      pass = true
    })

    expect(pass).toBe(true)
  })

  it('passes a copy of the widget API to the setup function', () => {
    const setup = jest.fn()
    Dash.widget('v0', setup)
    expect(setup).toBeCalledWith(expect.any(Object))
  })
})
