import { Server, api_sudo, Auth_Env } from 'iosignal'

let authManager = new Auth_Env('admin.adminkey.255')
const server = new Server({ port: 7777 }, authManager)

// api  response module
server.api('sudo', api_sudo)
