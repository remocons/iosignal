// 장치 타입 이름 규칙: <이름>.<major>   예) switch4.1, iris.2
//   공식 타입만 있다. 파일은 static/types/<이름>.<major>.json 이고 앱과 함께 배포한다.
//   그 밖의 화면은 장치가 $panel로 직접 보낸다.
// 예전 이름 remocon/<이름>/v<major>도 같은 타입으로 읽는다: 이미 나온 보드가 보낸다.
// 이름은 소문자, 숫자, '-'만 쓴다. '@', '#', '$', ':', ',', ';', '=' 는 태그와 $name·$ui의 구분자다.
// 하위 호환이 깨질 때만 major를 올리고, 호환되는 수정은 같은 이름의 rev를 올린다.

const TYPE_PATTERN = /^([a-z0-9][a-z0-9-]{0,39})\.([1-9][0-9]{0,3})$/;
const LEGACY_PATTERN = /^remocon\/([a-z0-9][a-z0-9-]{0,39})\/v([1-9][0-9]{0,3})$/;

export function parseType(text) {
	if (typeof text !== 'string') return null;
	const trimmed = text.trim();
	const match = TYPE_PATTERN.exec(trimmed) ?? LEGACY_PATTERN.exec(trimmed);
	if (!match) return null;
	const [, model, major] = match;
	return { type: `${model}.${major}`, model, major: Number(major), official: true, legacy: match.input !== `${model}.${major}` };
}

// 예전 이름은 새 이름으로, 타입이 아닌 값은 그대로 돌려준다.
export function normalizeType(text) {
	return parseType(text)?.type ?? text;
}
