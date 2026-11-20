export default {
  name: '선풍기:가상 장치',
  type: 'fan.1',
  ui: 'on,off,toggle',
  state: { on: '0', speed: '1', swing: '0' },
  view: { kind: 'fan', on: 'on', speed: 'speed' },
}
