import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: './src/client/IOWebSocket.js',
    output: [
      {
        file: './dist/iosignal.js',
        format: 'es', // 
        sourcemap: true,
      },
      {
        file: './dist/iosignal.iife.js',
        format: 'iife',
        name: 'IO',
        sourcemap: true,
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      commonjs()
      ,terser() 
    ]
  },
  {
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
      commonjs()
      ,terser() 
    ]
  }

]
