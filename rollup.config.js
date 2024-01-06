import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import pkg from './package.json'

export default [
  {
    input: './indexWebBrowser.js',
    output: [
      {
        file: pkg.browser,
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
      resolve(), 
      commonjs() 
      ,terser() 
    ]
  }
  ,{
    input: './src/client/IOWebSocket.js',
    output: [
      {
        file: pkg.browser_esm,
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
      resolve(), 
      commonjs() 
      ,terser() 
    ]
  }

  ,{
    input: './index.js',
    output: [
      { file: pkg.main,
        format: 'cjs'
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: true
      }), 
      json(),
      commonjs()
      ,terser() 
    ]
  }

]
