// Globals the shared server source expects from Node.js. Import this module before the server.
import Boho from 'boho'

// Manager/RemoteCore use Buffer (Buffer.from, concat, readUInt16BE, allocUnsafeSlow ...).
// Node.js keeps its own; a browser gets the Buffer that Boho bundles.
if (typeof globalThis.Buffer === 'undefined') globalThis.Buffer = Boho.Buffer
