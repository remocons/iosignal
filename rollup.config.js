import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'

export default [
   {
    input: './src/client/browser/IOWebSocket.js',
    output: [
      {
        file: './dist/io.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: './dist/io.min.js',
        format: 'umd',
        name: 'IO',
        sourcemap: true,
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      commonjs(),
      json(),
      terser() 
    ]
  },
  {
    input: './src/client/browser/IOWebSocket.js',
    output: { file: './dist/io.d.ts', format: 'es' },
    plugins: [dts()]
  }

  ,{
    input: './index.js',
    output: [
      { file: './dist/iosignal.js', format: 'es' }
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }), 
      json(),      
      commonjs()
    ]
  }

]
