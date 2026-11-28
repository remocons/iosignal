// 표준 명령을 상태에 적용한다. 가상 장치와 스키마 미리보기에서 실제 장치 동작을 흉내낸다.
//   on | off | toggle       → on=1/0
//   all=1 | all=0           → 0/1 값의 모든 채널 키(r1, s2, led1: 소문자+숫자)
//   key=value               → key 설정
//   ?                       → 바꾸지 않음(상태 묻기, 답은 $state)
const KEY = /^[A-Za-z_][\w-]{0,31}$/;

export function applyCommand(state, command) {
	const next = { ...state };
	delete next._;
	const cmd = String(command ?? '').trim();
	// '?' asks for the state only (the scanner's check): nothing changes, the device answers with its $state.
	if (cmd === '?') return { state, changed: false };
	if (cmd === 'on' || cmd === 'off') next.on = cmd === 'on' ? '1' : '0';
	else if (cmd === 'toggle') next.on = next.on === '1' ? '0' : '1';
	else if (cmd.includes('=')) {
		const index = cmd.indexOf('=');
		const key = cmd.slice(0, index).trim();
		const value = cmd.slice(index + 1).trim();
		if (!KEY.test(key) || value.includes(';')) return { state, changed: false };
		if (key === 'all') {
			const channels = Object.keys(next).filter((k) => /^[a-z]+\d+$/.test(k) && (next[k] === '0' || next[k] === '1'));
			if (!channels.length || (value !== '0' && value !== '1')) return { state, changed: false };
			for (const channel of channels) next[channel] = value;
		} else next[key] = value;
	} else {
		// 알 수 없는 버튼 명령은 마지막 명령으로만 기록한다.
		next.last = cmd.slice(0, 32);
	}
	const before = { ...state };
	delete before._;
	const keys = new Set([...Object.keys(before), ...Object.keys(next)]);
	const changed = [...keys].some((key) => before[key] !== next[key]);
	return { state: next, changed };
}
