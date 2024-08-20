import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
// import json from '@rollup/plugin-json'

export default [
  {
    input: './indexWebBrowser.js',
    output: [
      {
        file: './dist/iosignal-iife.js',
        format: 'iife', 
        name: 'IO',
        sourcemap: true,
      }

    ],
    plugins: [
      replace({
        crypto: '',
        delimiters: ['import { webcrypto } from \'', '\''],
        preventAssignment: true
      }),
      resolve({
        preferBuiltins: false
      }), 
      commonjs() 
      ,terser() 
    ]
  }
  ,{
    input: './src/client/IOWebSocket.js',
    output: [
      {
        file: './dist/iosignal.js',
        format: 'es', // 
        sourcemap: true,
      }
    ],
    plugins: [
      replace({
        crypto: '',
        delimiters: ['import { webcrypto } from \'', '\''],
        preventAssignment: true
      }),
      resolve({
        preferBuiltins: false
      }), 
      commonjs() 
      ,terser() 
    ]
  }

  ,{
    input: './index.js',
    output: [
      { file: './dist/iosignal.cjs',
        format: 'cjs'
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }), 
      // json(),
      commonjs()
      ,terser() 
    ]
  }

]
