// 위젯 값 → 장치 명령 문자열.  "level={v}" + 70 → "level=70"
export function renderCommand(template, value) {
	const text = typeof template === 'string' && template ? template : '{v}';
	return text.split('{v}').join(value == null ? '' : String(value));
}

/**
 * 연속 입력(슬라이더 드래그)용. 첫 값은 바로 보내고 이후는 ms 간격으로 마지막 값만 보낸다.
 * flush()는 손을 뗄 때 최종값을 보장한다.
 */
export function createThrottle(send, ms = 150, timers = globalThis) {
	let last = 0;
	let pending;
	let hasPending = false;
	let timer = null;
	let lastSent;

	function fire(value) {
		last = Date.now();
		lastSent = value;
		hasPending = false;
		send(value);
	}

	return {
		call(value) {
			const wait = ms - (Date.now() - last);
			if (wait <= 0 && !timer) {
				fire(value);
				return;
			}
			pending = value;
			hasPending = true;
			if (!timer) {
				timer = timers.setTimeout(() => {
					timer = null;
					if (hasPending) fire(pending);
				}, Math.max(wait, 0));
			}
		},
		flush(value) {
			if (timer) timers.clearTimeout(timer);
			timer = null;
			const final = value === undefined ? pending : value;
			if (value !== undefined || hasPending) {
				if (final !== lastSent) fire(final);
				hasPending = false;
			}
		},
		cancel() {
			if (timer) timers.clearTimeout(timer);
			timer = null;
			hasPending = false;
		}
	};
}
