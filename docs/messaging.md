# Signal tags and direct messages

[README](https://github.com/remocons/iosignal/blob/main/README.md) | [English](https://github.com/remocons/iosignal/blob/main/docs/messaging.md) | [한국어](https://github.com/remocons/iosignal/blob/main/docs/messaging.ko.md)

## Signal tags at a glance

| Communication | Send | Subscribe | Received tag |
| --- | --- | --- | --- |
| Channel | `room#topic` | `room#topic` | `room#topic` |
| Home channel | `#topic` | `#topic` | `#topic` |
| Direct to B | `B@topic` | Not required | `@topic` |
| Publication by A | A sends `@topic` | `A@topic` | `A@topic` |

For retained publications, use a tag containing `$`, such as `room#$state` or
`@$state`. Retention policies and limits depend on server/service configuration
and authentication type. See [signal tags](https://iosignal.net/docs/core/signal_tags)
and [signal types](https://iosignal.net/docs/core/signal_types) for details.

**Special-character usage guidance:** Tags beginning with a special character may be used for special features.
Start general-purpose tags with a letter or number, and use documented special characters such as `#` and `@` only in their documented positions and forms.
Avoid tags beginning with special characters whose usage is not documented, such as `$aaaa` and `/bbb`.
Avoid special characters with no documented usage elsewhere in a tag as well.
This guidance adds no new error handling or input restrictions; existing tag-processing rules still apply.

## Receiving direct messages

Since 7.2.0, a direct message to `B@topic` emits both `@` and `@topic` on B.
Use either `on()` or `listen()` with either event name:

| Event name | `on()` | `listen()` | Receives |
| --- | --- | --- | --- |
| `@` | `io.on('@', handler)` | `io.listen('@', handler)` | All direct messages |
| `@topic` | `io.on('@topic', handler)` | `io.listen('@topic', handler)` | Direct messages with that exact topic |

```js
function handler(tag, ...args) {
  console.log(tag, ...args);
}

// Choose one registration for this handler:
io.on('@topic', handler);
// io.listen('@topic', handler);
// io.on('@', handler);
// io.listen('@', handler);
```

Both events pass `(tag, ...args)`, with the destination CID removed from `tag`.
The client emits `@` first, then the exact topic event. A message to `B@` emits
`@` only once. Direct messages do not emit `message`.

Direct reception requires no subscription, including when using `listen()`.
`subscribe('@topic')` and `unsubscribe('@topic')` throw `TypeError`; use
`off(eventName, handler)` to remove an `on()` or `listen()` handler.
Registering the same work on both events, or forwarding from `@` with
`emit(tag, ...)`, causes duplicate handling.
