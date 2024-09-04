import { Server, api_reply } from 'iosignal'

const server = new Server({ port: 7777 })

// api  response module
server.api('reply', api_reply)
