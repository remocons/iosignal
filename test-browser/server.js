import { Server, version } from 'iosignal'

const options = {
  port: 7777,
  showMetric: 2,
  showMessage: 'message'
}

const server = new Server(options)
console.log( 'iosignal version: ', version )


