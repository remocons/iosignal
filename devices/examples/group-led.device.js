// A member of a group: found as #lab, it follows the shared #lab$state. The app writes that state,
// so every member with this channel changes together.
export default {
  name: '그룹 LED:가상 장치',
  channel: '#lab',
  state: { led1: '0', led2: '0' },
  view: { kind: 'relays', keys: ['led1', 'led2'] },
  schema: {
    schema: 1,
    controls: [
      { widget: 'switch', label: 'LED 1', key: 'led1', cmdOn: 'led1=1', cmdOff: 'led1=0' },
      { widget: 'switch', label: 'LED 2', key: 'led2', cmdOn: 'led2=1', cmdOff: 'led2=0' },
    ],
  },
}
