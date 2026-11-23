// 위젯 값 → 장치 명령 문자열.  "level={v}" + 70 → "level=70"
export function renderCommand(template, value) {
	const text = typeof template === 'string' && template ? template : '{v}';
	return text.split('{v}').join(value == null ? '' : String(value));
}

/**
 * 연속 입력(슬라이더 드래그)용. 첫 값은 바로 보내고 이후는 ms 간격으로 마지막 값만 보낸다.
 * flush()는 손을 뗄 때 최종값을 보장한다(대기 중이어도 바로 보냄).
 *
 * options.answerMs > 0 이면 한 번에 명령 하나만 보낸다: 보낸 뒤에는 장치가 `$state`로 답해
 * answered()가 불리거나 answerMs가 지날 때까지 다음 값을 보내지 않는다. 링크가 느리면 그만큼
 * 천천히 보내고, 빠르면 지금처럼 ms 간격을 지킨다. 장치는 명령마다 `$state`로 답한다(장치 규칙).
 */
export function createThrottle(send, ms = 150, timers = globalThis, { answerMs = 0, now = () => Date.now() } = {}) {
	let last = -Infinity;
	let pending;
	let hasPending = false;
	let timer = null;
	let answerTimer = null;
	let inFlight = false;
	let lastSent;

	function clearAnswer() {
		if (answerTimer) timers.clearTimeout(answerTimer);
		answerTimer = null;
		inFlight = false;
	}

	function fire(value) {
		last = now();
		lastSent = value;
		hasPending = false;
		if (answerMs > 0) {
			clearAnswer();
			inFlight = true;
			answerTimer = timers.setTimeout(() => {
				answerTimer = null;
				inFlight = false;
				schedule();
			}, answerMs);
		}
		send(value);
	}

	// 대기 값이 있으면 보낼 수 있는 때(간격, 답)를 기다려 보낸다.
	function schedule() {
		if (!hasPending || timer || inFlight) return;
		const wait = ms - (now() - last);
		if (wait <= 0) {
			fire(pending);
			return;
		}
		timer = timers.setTimeout(() => {
			timer = null;
			if (hasPending && !inFlight) fire(pending);
		}, wait);
	}

	return {
		call(value) {
			pending = value;
			hasPending = true;
			schedule();
		},
		// 장치가 답했다(`$state`가 왔다). answerMs를 쓰지 않으면 아무 일도 하지 않는다.
		answered() {
			if (!inFlight) return;
			clearAnswer();
			schedule();
		},
		get inFlight() {
			return inFlight;
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
			clearAnswer();
			hasPending = false;
		}
	};
}
