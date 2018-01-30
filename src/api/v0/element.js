export default function(state) {
  function _base(props) {
    // Handle all the common element setup
  }

  function textbox() {
    console.log('Instantiating a textbox element')
  }

  function text() {
    console.log('Instantiating a text element')
  }

  return {
    text,
    textbox
  }
}
