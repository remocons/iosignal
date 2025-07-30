export type STATES = {
    OPENING: number;
    OPEN: number;
    CLOSING: number;
    CLOSED: number;
    SERVER_READY: number;
    AUTH_FAIL: number;
    AUTH_READY: number;
    READY: number;
    REDIRECTING: number;
};
export namespace STATES {
    let OPENING: number;
    let OPEN: number;
    let CLOSING: number;
    let CLOSED: number;
    let SERVER_READY: number;
    let AUTH_FAIL: number;
    let AUTH_READY: number;
    let READY: number;
    let REDIRECTING: number;
}
export type CLIENT_STATE = {
    INIT: number;
    SENT_SERVER_READY: number;
    RECV_AUTH_REQ: number;
    SENT_SERVER_NONCE: number;
    RECV_AUTH_HMAC: number;
    AUTH_FAIL: number;
    AUTH_READY: number;
    CID_READY: number;
};
export namespace CLIENT_STATE {
    export let INIT: number;
    export let SENT_SERVER_READY: number;
    export let RECV_AUTH_REQ: number;
    export let SENT_SERVER_NONCE: number;
    export let RECV_AUTH_HMAC: number;
    let AUTH_FAIL_1: number;
    export { AUTH_FAIL_1 as AUTH_FAIL };
    let AUTH_READY_1: number;
    export { AUTH_READY_1 as AUTH_READY };
    export let CID_READY: number;
}
export type ENC_MODE = {
    NO: number;
    YES: number;
    AUTO: number;
};
export namespace ENC_MODE {
    let NO: number;
    let YES: number;
    let AUTO: number;
}
export type SIZE_LIMIT = {
    TAG_LEN1: number;
    TAG_LEN2: number;
    CONNECTION_CHECKER_PERIOD: number;
    PROMISE_TIMEOUT: number;
    DID: number;
    CID: number;
};
export namespace SIZE_LIMIT {
    let TAG_LEN1: number;
    let TAG_LEN2: number;
    let CONNECTION_CHECKER_PERIOD: number;
    let PROMISE_TIMEOUT: number;
    let DID: number;
    let CID: number;
}
export type PAYLOAD_TYPE = {
    EMPTY: number;
    TEXT: number;
    BINARY: number;
    OBJECT: number;
    MJSON: number;
    MBA: number;
};
export namespace PAYLOAD_TYPE {
    let EMPTY: number;
    let TEXT: number;
    let BINARY: number;
    let OBJECT: number;
    let MJSON: number;
    let MBA: number;
}
export type IOMsg = {
    SERVER_READY: number;
    CID_REQ: number;
    CID_RES: number;
    QUOTA_LEVEL: number;
    SERVER_CLEAR_AUTH: number;
    SERVER_REDIRECT: number;
    LOOP: number;
    ECHO: number;
    PING: number;
    PONG: number;
    CLOSE: number;
    SIGNAL: number;
    SIGNAL_REQ: number;
    SIGNAL_E2E: number;
    SUBSCRIBE: number;
    SUBSCRIBE_REQ: number;
    UNSUBSCRIBE: number;
    SERVER_SIGNAL: number;
    IAM: number;
    IAM_RES: number;
    SET: number;
    RESPONSE_CODE: number;
    RESPONSE_MBP: number;
    REQUEST: number;
    RESPONSE: number;
    FLOW_MODE: number;
    WAIT: number;
    RESUME: number;
    TIME_OUT: number;
    OVER_SIZE: number;
    OVER_FLOW: number;
};
export namespace IOMsg {
    let SERVER_READY_1: number;
    export { SERVER_READY_1 as SERVER_READY };
    export let CID_REQ: number;
    export let CID_RES: number;
    export let QUOTA_LEVEL: number;
    export let SERVER_CLEAR_AUTH: number;
    export let SERVER_REDIRECT: number;
    export let LOOP: number;
    export let ECHO: number;
    export let PING: number;
    export let PONG: number;
    export let CLOSE: number;
    export let SIGNAL: number;
    export let SIGNAL_REQ: number;
    export let SIGNAL_E2E: number;
    export let SUBSCRIBE: number;
    export let SUBSCRIBE_REQ: number;
    export let UNSUBSCRIBE: number;
    export let SERVER_SIGNAL: number;
    export let IAM: number;
    export let IAM_RES: number;
    export let SET: number;
    export let RESPONSE_CODE: number;
    export let RESPONSE_MBP: number;
    export let REQUEST: number;
    export let RESPONSE: number;
    export let FLOW_MODE: number;
    export let WAIT: number;
    export let RESUME: number;
    export let TIME_OUT: number;
    export let OVER_SIZE: number;
    export let OVER_FLOW: number;
}
export type API_TYPE = {
    REQUEST_RESPONSE: string;
    ONE_WAY: string;
};
export namespace API_TYPE {
    let REQUEST_RESPONSE: string;
    let ONE_WAY: string;
}
export type STATUS = {
    OK: number;
    ERROR: number;
};
export namespace STATUS {
    let OK: number;
    let ERROR: number;
}
