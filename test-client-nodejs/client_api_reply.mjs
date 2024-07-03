
import { IO } from "iosignal"

const io = new IO('ws://localhost:7777')

io.on('ready', async () => {
  let res_echo = await io.req('reply', 'echo', 'hello')
  let res_date = await io.req('reply', 'date')
  let res_unixtime = await io.req('reply', 'unixtime')

  if (res_echo.ok) console.log(res_echo.body)
  if (res_date.ok) console.log(res_date.body)
  if (res_unixtime.ok) console.log(res_unixtime.body)

});
