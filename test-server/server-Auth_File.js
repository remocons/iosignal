import { Server, Auth_File } from '../index.js'

const options = {
  port: 7777,
  showMetric: 2,
  showMessage: 'message'
}

// const server = new Server( options, new Auth_File('../authInfo.json') )  // JSON version.  cannot add comments.
const server = new Server(options, new Auth_File('../auth_file.mjs'))      // JS version. it support comments. 


