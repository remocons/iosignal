let { Server, serverOption } = require('iosignal')

  serverOption.showMetric = 2;
  // serverOption.port = 7777  // default. websocket port 7777 will be open.
  serverOption.congPort = 8888  // additional tcp cong port open.  for Arduino like devices.
  const server = new Server( serverOption )
  console.log( 'serverOption:', serverOption )

