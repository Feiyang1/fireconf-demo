
import typescript from 'rollup-plugin-typescript2';
import resolveModule from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss'

const plugins = [
  typescript({
    typescript: require('typescript')
  }),
  resolveModule({
    mainFields: ['esm2017', 'module']
  }),
  commonjs(),
  terser({
    format: {
      comments: false
    },
    mangle: { toplevel: true },
    compress: false
  }),
  scss()
];

export default [
  {
    input: 'src/main.ts',
    output: [
      { file: 'dist/bundle.js', format: 'iife' }
    ],
    plugins
  },
];
