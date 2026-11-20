// One connection per broker URL for the cards a page places on its own (<iosignal-device-card cid="...">).
// Every card on the page that names the same URL shares it; it closes when the last one leaves.
// The cards follow their CIDs directly (<cid>@$name, $ui, $state), so they work for any device the broker
// lets them reach, not only the ones a #search in this home channel finds.
import IO from '../lib/io.js'
import { DeviceScanner } from '../shared/discovery.js'

const links = new Map()

export const defaultUrl = () => `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`

/**
 * @param {string} url broker WebSocket URL
 * @returns {{ io: any, follow(id: string, onChange: (device: object|null) => void): () => void, command(id: string, command: string): void }}
 */
export function useLink(url = defaultUrl()) {
  let link = links.get(url)
  if (!link) {
    const io = new IO(url)
    io.on('error', () => {})
    io.on('ready', () => io.iam('device-card'))
    const watchers = new Map() // id -> Set of callbacks
    const scanner = new DeviceScanner(io, {
      id: 'card-link', discover: false, views: true, known: () => [...watchers.keys()],
      onChange: () => {
        for (const [id, callbacks] of watchers) {
          const device = scanner.list().find(item => item.id === id) ?? null
          for (const callback of callbacks) callback(device)
        }
      },
    })
    link = { io, scanner, watchers }
    links.set(url, link)
  }
  const { io, scanner, watchers } = link
  return {
    io,
    follow(id, onChange) {
      if (!watchers.has(id)) watchers.set(id, new Set())
      watchers.get(id).add(onChange)
      if (io.getStateName() === 'ready') scanner.search()
      onChange(scanner.list().find(item => item.id === id) ?? null)
      return () => {
        const callbacks = watchers.get(id)
        callbacks?.delete(onChange)
        if (callbacks && !callbacks.size) {
          watchers.delete(id)
          scanner.untrack(id)
        }
        if (!watchers.size) {
          scanner.dispose()
          io.destroy()
          links.delete(url)
        }
      }
    },
    command: (id, command) => scanner.command(id, command),
  }
}
