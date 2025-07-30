import { Server } from "iosignal"

const server = new Server(
  {
    port: 7777,     
    congPort: 8888, 
    showMetric: 2,  
    showMessage: 'message' // show signal message
  })


console.log('Signaling server started. Listening on port 7777 and congPort 8888');
