
/**
 * @typedef {object} STATE
 * @property {number} CONNECTING
 * @property {number} OPEN
 * @property {number} SERVER_READY
 * @property {number} AUTH_ACK
 * @property {number} CLOSING
 * @property {number} READY
 * @property {number} AUTH_FAIL
 * @property {number} AUTH_CLEAR
 * @property {number} CLOSING
 * @property {number} CLOSED
 * @property {number} STOP
 * @property {number} REDIRECTING
 */
// Client STATE: name and number
export const STATE = {
  CONNECTING:    0,
  OPEN:          1,
  SERVER_READY: 10,
  AUTH_REQ:     11,
  AUTH_NONCE:   12,
  AUTH_HMAC:    13,
  AUTH_ACK:     14,
  AUTH_FAIL:    15,
  AUTH_CLEAR:   16,
  CID_REQ:      17,
  CID_RES:      18,
  READY:        19,
  CLOSING:       2,
  CLOSED:        3,
  STOP:          4,
  REDIRECTING:   5
}
for (let c in STATE) { STATE[STATE[c]] = c }


/**
 * @typedef {object} ENC_MODE
 * @property {number} NO
 * @property {number} YES
 * @property {number} AUTO
 */
export let ENC_MODE = {
  NO: 0,
  YES: 1,
  AUTO: 2
}

for (let c in ENC_MODE) { ENC_MODE[ENC_MODE[c]] = c }


/**
 * @typedef {object} SIZE_LIMIT
 * @property {number} TAG_LEN1
 * @property {number} TAG_LEN2
 * @property {number} CONNECTION_CHECKER_PERIOD
 * @property {number} CLIENT_PING_PERIOD
 * @property {number} PROMISE_TIMEOUT
 * @property {number} DID
 * @property {number} CID
 */
export const SIZE_LIMIT = {
  TAG_LEN1: 255,
  TAG_LEN2: 65535,
  CONNECTION_CHECKER_PERIOD: 3000,
  CLIENT_PING_PERIOD: 40000,
  PROMISE_TIMEOUT: 5000,
  DID: 8,
  CID: 12
}

/**
 * @typedef {object} PAYLOAD_TYPE
 * @property {number} EMPTY
 * @property {number} TEXT
 * @property {number} BINARY
 * @property {number} OBJECT
 * @property {number} MJSON
 * @property {number} MBA
 */
export let PAYLOAD_TYPE = {
  EMPTY: 0,
  TEXT: 1,
  BINARY: 2,
  OBJECT: 3, // one stringifiable object. it's string.
  MJSON: 4, // multiple stringifiable obejct. it's top-level array JSON string.
  MBA: 5  // "meta_buffer_arguments" arbitary types.  it's meta-buffer-pack.
}
for (let c in PAYLOAD_TYPE) { PAYLOAD_TYPE[PAYLOAD_TYPE[c]] = c }


/**
 * @typedef {object} IOMsg
 * @property {number} SERVER_READY
 * @property {number} CID_REQ
 * @property {number} CID_RES
 * @property {number} QUOTA_LEVEL
 * @property {number} AUTH_CLEAR
 * @property {number} SERVER_REDIRECT
 * @property {number} LOOP
 * @property {number} ECHO
 * @property {number} PING
 * @property {number} PONG
 * @property {number} CLOSE
 * @property {number} SIGNAL
 * @property {number} SIGNAL_REQ
 * @property {number} SIGNAL_E2E
 * @property {number} SUBSCRIBE
 * @property {number} SUBSCRIBE_REQ
 * @property {number} UNSUBSCRIBE
 * @property {number} SERVER_SIGNAL
 * @property {number} IAM
 * @property {number} IAM_RES
 * @property {number} SET
 * @property {number} RESPONSE_CODE
 * @property {number} RESPONSE_MBP
 * @property {number} REQUEST
 * @property {number} RESPONSE
 * @property {number} FLOW_MODE
 * @property {number} WAIT
 * @property {number} RESUME
 * @property {number} TIME_OUT
 * @property {number} OVER_SIZE
 * @property {number} OVER_FLOW
 */
// IO message's one-byte headers.
export let IOMsg = {

  /* 
  * 0~127dec.  reserved. for text stream.
  * 0~31: control code
  * 32~126: ascii charactor
  * 127: DEL
  */

  // ADMIN_REQ: 0xA0,

  // DO NOT USE: 0xB0~ 0xBF
  // Boho module using this numbers.
  // AUTH_REQ : 0xB0,  
  // AUTH_NONCE: 0xB1,
  // AUTH_HMAC: 0xB2,
  // AUTH_ACK: 0xB3,
  // AUTH_FAIL: 0xB4,
  // AUTH_EXT: 0xB5,
  // ENC_PACK : 0xB6,  
  // ENC_E2E : 0xB7,  
  // ENC_488 : 0xB8
  // reserved ~0xBF

  // C. IO status contorl.
  SERVER_READY: 0xC0,
  CID_REQ: 0xC1,
  CID_RES: 0xC2,
  QUOTA_LEVEL: 0xC3,
  AUTH_CLEAR: 0xC4,
  SERVER_REDIRECT: 0xC5,
  // ..
  LOOP: 0xCB,
  ECHO: 0xCC,
  PING: 0xCD,
  PONG: 0xCE,
  CLOSE: 0xCF,
  // ~CF


  // D. IO data signaling
  SIGNAL: 0xD0,
  SIGNAL_REQ: 0xD1,
  SIGNAL_E2E: 0xD2,
  SUBSCRIBE: 0xD3,
  SUBSCRIBE_REQ: 0xD4,
  UNSUBSCRIBE: 0xD5,
  SERVER_SIGNAL: 0xD6,

  // ..
  IAM: 0xD9,
  IAM_RES: 0xDA,

  //.. 
  SET: 0xDB,   //
  RESPONSE_CODE: 0xDC,
  RESPONSE_MBP: 0xDD,

  REQUEST: 0xDE, //client public
  RESPONSE: 0xDF,
  // ~DF


  // F. Framing Flow control related framing protocol.(CongPacket)
  FLOW_MODE: 0xF0,
  WAIT: 0xF1,
  RESUME: 0xF2,
  //..
  TIME_OUT: 0xFD,
  OVER_SIZE: 0xFE,
  OVER_FLOW: 0xFF

}

for (let c in IOMsg) { IOMsg[IOMsg[c]] = c }
// console.log( IOMsg );

/**
 * @typedef {object} API_TYPE
 * @property {string} REQUEST_RESPONSE
 * @property {string} ONE_WAY
 */
export const API_TYPE = {
  'REQUEST_RESPONSE': 'requet_response',
  'ONE_WAY': 'one_way'
}

/**
 * @typedef {object} STATUS
 * @property {number} OK
 * @property {number} ERROR
 */
// api response status code
export const STATUS = {
  OK: 0,
  //0~127: success
  //128~255: fail
  ERROR: 255
}
