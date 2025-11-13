export type STATE = {
    CONNECTING: number;
    OPEN: number;
    SERVER_READY: number;
    AUTH_ACK: number;
    CLOSING: number;
    READY: number;
    AUTH_FAIL: number;
    AUTH_CLEAR: number;
    CLOSED: number;
    STOP: number;
    REDIRECTING: number;
};
export namespace STATE {
    let CONNECTING: number;
    let OPEN: number;
    let SERVER_READY: number;
    let AUTH_REQ: number;
    let AUTH_NONCE: number;
    let AUTH_HMAC: number;
    let AUTH_ACK: number;
    let AUTH_FAIL: number;
    let AUTH_CLEAR: number;
    let CID_REQ: number;
    let CID_RES: number;
    let READY: number;
    let CLOSING: number;
    let CLOSED: number;
    let STOP: number;
    let REDIRECTING: number;
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
    AUTH_CLEAR: number;
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
    let CID_REQ_1: number;
    export { CID_REQ_1 as CID_REQ };
    let CID_RES_1: number;
    export { CID_RES_1 as CID_RES };
    export let QUOTA_LEVEL: number;
    let AUTH_CLEAR_1: number;
    export { AUTH_CLEAR_1 as AUTH_CLEAR };
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
