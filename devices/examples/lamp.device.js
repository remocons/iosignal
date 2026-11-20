// RGB light using the official remocon type: the standard commands (on, off, toggle, level=, color=) work as is.
export default {
  name: '거실 조명:가상 장치',
  type: 'rgb-light.1',
  ui: 'on,off,toggle',
  state: { on: '1', level: '70', color: '#ffb000' },
  view: { kind: 'bulb', on: 'on', level: 'level', color: 'color' },
}
