import path from 'node:path'
import { publicBoundary, root } from './scripts/public-policy.mjs'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'

// dist/browser/esm/broker.js runs the server in a web page: the Node.js modules it imports are
// mapped to the stand-ins in src/browser/env.
const STAND_INS = { ws: 'ws', events: 'events', net: 'net', http: 'http', fs: 'fs', 'fs/promises': 'fs',
  os: 'os', perf_hooks: 'perf_hooks', process: 'process', crypto: 'crypto' }
function browserStandIns() {
  return { name: 'browser-stand-ins', resolveId(source) {
    const name = source.replace(/^node:/, '')
    return Object.hasOwn(STAND_INS, name) ? path.join(root, 'src/browser/env', STAND_INS[name] + '.js') : null
  }}
}

export default [
  {
    input: './index.js',
    external: ['events', 'stream'],
    output: [
      { file: './dist/node/iosignal.d.ts', format: 'es' },
      { file: './dist/node/iosignal.d.cts', format: 'es' }
    ],
    plugins: [publicBoundary(), dts({ compilerOptions: { allowJs: true, types: ['node'] } })]
  },
   {
    preserveSymlinks: true,
    input: './src/client/browser/IOWebSocket.js',
    output: [
      {
        file: './dist/browser/esm/io.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: './dist/browser/iife/io.js',
        format: 'iife',
        name: 'IO',
        sourcemap: true,
      }
    ],
    plugins: [
      publicBoundary(),
      resolve({
        preferBuiltins: false
      }),
      commonjs(),
      json(),
      terser() 
    ]
  },
  {
    preserveSymlinks: true,
    input: './src/client/browser/IOWebSocket.js',
    output: { file: './dist/browser/esm/io.d.ts', format: 'es' },
    plugins: [
      publicBoundary(),dts()]
  }

  ,{
    preserveSymlinks: true,
    input: './src/browser/index.js',
    output: { file: './dist/browser/esm/broker.js', format: 'es', sourcemap: true },
    plugins: [
      publicBoundary(),
      browserStandIns(),
      resolve({ browser: true, preferBuiltins: false }),
      commonjs(),
      json(),
      terser()
    ]
  }

  ,{
    preserveSymlinks: true,
    input: './index.js',
    // ws loads these optional native addons at runtime.
    external: ['bufferutil', 'utf-8-validate'],
    output: [
      { 
        file: './dist/node/iosignal.js',
        format: 'es' 
      },
      {
        file: "./dist/node/iosignal.cjs",
        format: 'cjs'
      }
    ],
    plugins: [
      publicBoundary(),
      resolve({
        preferBuiltins: true
      }), 
      json(),      
      commonjs()
    ]
  }

]
