import babel from 'rollup-plugin-babel';

export default {
  input: './src/dash-bootstrap.js',
  plugins: [
    babel()
  ],
  output: {
    file: './dist/dash-widget.js',
    format: 'iife',
    name: 'Dash'
  }
}
