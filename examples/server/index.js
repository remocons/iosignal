
import { Server, api_reply } from 'iosignal'

const options = {
  port: 7777,
  // showMetric: 2,
  showMessage: 'message'
}
const ioss = new Server( options)

// api  response module
ioss.api('reply', api_reply)



