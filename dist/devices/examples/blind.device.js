// A custom device: its screen comes with it (@$panel), and it moves over time instead of jumping.
export default {
  name: '전동 블라인드:가상 장치',
  state: { position: '30', target: '30', motion: 'stop' },
  view: { kind: 'blind', position: 'position', motion: 'motion' },
  schema: {
    schema: 1,
    title: '전동 블라인드',
    controls: [
      { widget: 'slider', label: '위치', key: 'target', min: 0, max: 100, step: 5, unit: '%', cmd: 'target={v}' },
      { widget: 'row', children: [
        { widget: 'button', label: '열기', cmd: 'open' },
        { widget: 'button', label: '닫기', cmd: 'close' },
      ] },
      { widget: 'value', label: '현재 위치', key: 'position', unit: '%' },
      { widget: 'value', label: '동작', key: 'motion' },
    ],
  },
  every: 200,
  onCommand(command, device) {
    if (command === 'open') device.set({ target: '100' })
    else if (command === 'close') device.set({ target: '0' })
    else return false // target=N falls through to the standard handling
    return true
  },
  onTick(device) {
    const position = Number(device.state.position)
    const target = Number(device.state.target)
    if (position === target) {
      if (device.state.motion !== 'stop') device.set({ motion: 'stop' })
      return
    }
    const next = position + Math.sign(target - position) * Math.min(2, Math.abs(target - position))
    device.set({ position: String(next), motion: target > position ? 'opening' : 'closing' })
  },
}
