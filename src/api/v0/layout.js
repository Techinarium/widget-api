export default function() {
  function layout(conf) {
    console.log('Creating layout with', conf)

    console.log('Rendering view', conf.render())
  }

  function setLayout(name, transition) {
    console.log('Setting layout to ' + name)
  }

  return { layout, setLayout }
}
