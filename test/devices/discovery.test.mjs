// The device rules v2 against a real server: $name, $ui, $panel, $view.
import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { readFileSync } from 'node:fs';

// Private source entry in development; package self-reference for public builds.
const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
const { Server } = await import(pkg.private ? '../../index.js' : 'iosignal');
const { default: IO } = await import(pkg.private ? '../../dist/browser/esm/io.js' : 'iosignal/io.js');
import { DeviceScanner } from '../../devices/shared/discovery.js';
import { pickSchema, validateSchema } from '../../devices/shared/schema.js';

async function until(check, label = 'condition') {
	for (let n = 0; n < 100; n++) {
		if (check()) return;
		await delay(20);
	}
	throw new Error('timed out: ' + label);
}

// 실제 서버에 앱과 장치를 연결해 펌웨어가 보내는 메시지를 그대로 재현한다.
async function setup(t, options = {}) {
	globalThis.document ??= { addEventListener() {}, removeEventListener() {} };
	const server = new Server({ port: 0, ...options });
	await once(server, 'ready');
	const clients = [];
	const connect = async () => {
		const io = new IO(`ws://localhost:${server.port}`);
		clients.push(io);
		await once(io, 'ready');
		return io;
	};
	const app = await connect();
	const scanner = new DeviceScanner(app, { id: 'app' });
	t.after(async () => {
		scanner.dispose();
		for (const io of clients) io.destroy();
		await new Promise((resolve) => server.close(resolve));
	});
	return { app, scanner, connect };
}

test('$name과 버튼 목록 $ui 장치(기본 방식)를 찾아 버튼으로 제어한다', async (t) => {
	const { scanner, connect } = await setup(t);
	const board = await connect();
	const commands = [];
	board.link('test', '#search', () => board.signal('#notify', board.cid));
	board.listen('@', (tag, command) => commands.push(command));
	board.signal('@$state', 'on');
	board.signal('@$ui', 'on,off,toggle');
	board.signal('@$name', 'UnoR4-WiFi:HOME');
	await delay(30);
	scanner.search();

	await until(() => scanner.devices.get(board.cid)?.name && scanner.devices.get(board.cid)?.ui, 'name and ui');
	const device = scanner.devices.get(board.cid);
	assert.deepEqual([device.name, device.group, device.ui, device.state, device.legacyUi], ['UnoR4-WiFi', 'HOME', 'on,off,toggle', 'on', true]);
	assert.equal(pickSchema({ ui: device.ui }).schema.controls[0].widget, 'buttons');

	scanner.command(board.cid, 'toggle');
	await until(() => commands.length, 'command');
	assert.deepEqual(commands, ['toggle']);
});

test('남아 있는 $info는 읽지 않는다', async (t) => {
	const { app, scanner, connect } = await setup(t);
	const board = await connect();
	board.signal('@$info', 'n=Old;t=relay4.1');
	board.signal('@$name', 'New');
	board.signal('@$ui', 't=light.1');
	board.signal('@$state', 'on=1');
	await delay(30);
	scanner.track(board.cid);
	await until(() => scanner.devices.get(board.cid).type, '$ui');
	const device = scanner.devices.get(board.cid);
	assert.deepEqual([device.name, device.type, device.legacyUi], ['New', 'light.1', false]);
	assert.equal(app.channels.has(board.cid + '@$info'), false);
});

test('#scan/ch 채널 그룹은 찾지 않고, 버튼 목록 $ui의 그룹(legacy2)은 목록에 넣지 않는다', async (t) => {
	const { app, scanner, connect } = await setup(t);
	const board = await connect();
	const asked = [];
	board.link('test', '#scan/ch', () => (asked.push(1), board.signal('#detect/ch', '#Iris-g1')));
	board.link('test', '#search', () => board.signal('#notify', '#old'));
	board.signal('#old$name', '사무실');
	board.signal('#old$ui', 'A,B');
	await delay(30);
	scanner.search();
	await until(() => scanner.devices.get('#old')?.ui, 'old group read');
	assert.deepEqual(asked, []);
	assert.equal(scanner.devices.has('#Iris-g1'), false);
	assert.equal(app.listenerCount('#detect/ch'), 0);
	assert.deepEqual(scanner.list().map((device) => device.id), []);
});

test('#$switch 공유 스위치는 더 제공하지 않는다', async (t) => {
	const { app, scanner } = await setup(t);
	scanner.search();
	await delay(50);
	assert.equal(scanner.devices.has('#$switch'), false);
	assert.equal(app.listenerCount('#$switch'), 0);
});

test('등록 장치만 보는 화면은 검색하지 않고 $ui를 받는다', async (t) => {
	const { connect } = await setup(t);
	const board = await connect();
	const io = await connect();
	const sent = [];
	const signal = io.signal.bind(io);
	io.signal = (tag, ...rest) => (sent.push(tag), signal(tag, ...rest));
	board.signal('@$ui', 'on,off');
	await delay(30);
	const scanner = new DeviceScanner(io, { id: 'mine', discover: false, known: () => [board.cid] });
	t.after(() => scanner.dispose());
	scanner.search();
	await until(() => scanner.devices.get(board.cid)?.ui, '$ui');
	assert.deepEqual(sent, []);
});

test('연결이 끊긴 장치는 잊고 그 구독을 모두 해제한다, 등록 장치는 남긴다', async (t) => {
	const { app, scanner, connect } = await setup(t);
	const known = await connect();
	const knownCid = known.cid; // destroy() clears io.cid
	scanner.known = () => [knownCid];
	const base = app.channels.size;
	const board = await connect();
	board.signal('@$name', 'Gone');
	board.signal('@$state', 'on=1');
	known.signal('@$name', 'Mine');
	known.signal('@$state', 'on=1');
	await delay(30);
	scanner.track(board.cid);
	scanner.track(known.cid);
	await until(() => scanner.devices.get(board.cid)?.state && scanner.devices.get(known.cid)?.state, 'both online');
	const cid = board.cid;
	assert.ok([...app.channels].some((tag) => tag.startsWith(cid + '@')));

	board.destroy();
	known.destroy();
	await until(() => !scanner.devices.has(cid), 'closed device forgotten');
	assert.deepEqual([...app.channels].filter((tag) => tag.startsWith(cid + '@')), []);
	await until(() => scanner.devices.get(knownCid)?.state === '', 'known device offline');
	assert.ok(scanner.devices.has(knownCid), 'a known device stays, shown offline');
	assert.equal(app.channels.size, base + 3, 'only the known device keeps its tags: $name, $ui and $state');
});

// 장치처럼 #search에 #notify로 답하고 $name, $state를 남긴다.
async function boardsOn(connect, count) {
	const boards = [];
	for (let i = 0; i < count; i++) {
		const board = await connect();
		board.link('test', '#search', () => board.signal('#notify', board.cid));
		board.signal('@$name', 'B' + i);
		board.signal('@$state', 'on=1');
		boards.push(board);
	}
	await delay(30);
	return boards;
}

test('다시 검색은 이미 찾은 장치를 다시 구독하지 않고 #search만 보낸다', async (t) => {
	const { app, scanner, connect } = await setup(t);
	const boards = await boardsOn(connect, 5);
	scanner.search();
	await until(() => scanner.list().length === 5, 'all found');
	await delay(50);
	const sent = [];
	const send = app.send_enc_mode.bind(app);
	app.send_enc_mode = (data) => (sent.push(data), send(data));
	for (let i = 0; i < 3; i++) scanner.search();
	await delay(100);
	assert.equal(sent.length, 3);
	assert.equal(scanner.list().length, 5);
	assert.ok(boards.every((board) => scanner.devices.get(board.cid).state === 'on=1'));
});

// 서버는 연결의 초당 메시지 한도(익명 100건)를 넘는 메시지를 알리지 않고 버린다.
test('서버 한도로 구독이 버려진 장치는 다음 응답 때 다시 구독해 모두 찾는다', async (t) => {
	const { scanner, connect } = await setup(t, { quotas: { anonymous: { msgPerSec: 15 } } });
	const boards = await boardsOn(connect, 6);
	const found = () => boards.filter((board) => scanner.devices.get(board.cid)?.state === 'on=1').length;
	for (let i = 0; i < 12 && found() < boards.length; i++) {
		scanner.search();
		await delay(600);
	}
	assert.equal(found(), boards.length);
	assert.ok(boards.every((board) => scanner.devices.get(board.cid).name.startsWith('B')));
});

// $ui는 보드도 읽는 짧은 key=value, 화면은 p=1일 때만 <cid>@$panel로 따로 받는다.
test('p=1 장치는 $panel 화면을 받고, 없는 장치는 $panel을 구독하지 않는다', async (t) => {
	const { app, scanner, connect } = await setup(t);
	const screen = { schema: 1, title: '스위치', controls: [{ widget: 'switch', label: 'NORTH 앞', key: 's1', cmdOn: 's1=1', cmdOff: 's1=0' }] };
	const named = await connect();
	const plain = await connect();
	named.signal('@$panel', JSON.stringify(screen));
	named.signal('@$name', '1층 스위치:공장');
	named.signal('@$ui', 't=switch3.1;p=1');
	named.signal('@$state', 's1=1');
	plain.signal('@$name', '전등');
	plain.signal('@$ui', 't=light.1');
	plain.signal('@$state', 'on=1');
	await delay(30);
	scanner.track(named.cid);
	scanner.track(plain.cid);
	await until(() => scanner.devices.get(named.cid)?.schema && scanner.devices.get(plain.cid)?.state, 'described');
	const device = scanner.devices.get(named.cid);
	assert.deepEqual([device.name, device.group, device.type, device.hasPanel], ['1층 스위치', '공장', 'switch3.1', true]);
	assert.deepEqual(device.schema, screen);
	assert.ok(validateSchema(device.schema).ok);
	assert.ok(app.channels.has(named.cid + '@$panel'));
	assert.equal(scanner.devices.get(plain.cid).hasPanel, false);
	assert.equal(app.channels.has(plain.cid + '@$panel'), false);

	// $ui를 다시 보내도 화면은 남고, p=1이 빠지면 화면과 구독을 버린다.
	named.signal('@$ui', 't=switch3.1;p=1;b=a');
	await until(() => scanner.devices.get(named.cid).ui === 'a', 'ui again');
	assert.deepEqual(device.schema, screen);
	named.signal('@$ui', 't=switch3.1');
	await until(() => !device.hasPanel, 'p=1 gone');
	assert.equal(device.schema, null);
	assert.equal(app.channels.has(named.cid + '@$panel'), false);
});

test('v=1 장치의 $view는 views 스캐너만 구독한다', async (t) => {
	const { app, scanner, connect } = await setup(t);
	const board = await connect();
	const picture = { kind: 'fan', on: 'on', speed: 'speed' };
	board.signal('@$view', JSON.stringify(picture));
	board.signal('@$name', '선풍기');
	board.signal('@$ui', 't=fan.1;v=1');
	board.signal('@$state', 'on=1;speed=2');
	const io = await connect();
	const drawing = new DeviceScanner(io, { id: 'drawing', views: true });
	t.after(() => drawing.dispose());
	await delay(30);
	scanner.track(board.cid);
	drawing.track(board.cid);
	await until(() => drawing.devices.get(board.cid)?.view && scanner.devices.get(board.cid)?.state, 'view');
	assert.deepEqual(drawing.devices.get(board.cid).view, picture);
	assert.equal(scanner.devices.get(board.cid).hasView, true);
	assert.equal(scanner.devices.get(board.cid).view, null);
	assert.equal(app.channels.has(board.cid + '@$view'), false, '그림을 그리지 않는 앱은 구독하지 않는다');
	assert.ok(io.channels.has(board.cid + '@$view'));
});

// 접속 뒤 #search는 한 번이면 된다. 1초 뒤의 두 번째 검색은 찾은 장치가 아직 보이지 않을 때만 보낸다.
test('접속 뒤 모든 장치가 보이면 다시 검색하지 않고, 이름이 없는 장치가 있으면 한 번 더 검색한다', async (t) => {
	const { scanner, connect } = await setup(t);
	// The scanner already ran its own first search and set its 1 s check on connecting; let that check pass
	// first, or under load it lands in the window below and counts one more search.
	await delay(1100);
	const board = await connect();
	let searches = 0;
	board.link('test', '#search', () => (searches++, board.signal('#notify', board.cid)));
	board.signal('@$state', 'on=1');
	board.signal('@$ui', 't=light.1');
	board.signal('@$name', 'Lamp:HOME');
	await delay(30);
	scanner.onReady(); // 접속 직후와 같은 순서: 검색, 1초 뒤 확인
	await until(() => scanner.devices.get(board.cid)?.name, 'found');
	await delay(1300);
	assert.equal(searches, 1);

	const silent = await connect(); // 답은 하지만 $name을 보내지 않는 장치
	silent.link('test', '#search', () => silent.signal('#notify', silent.cid));
	silent.signal('@$state', 'on=1');
	await delay(30);
	searches = 0;
	scanner.onReady();
	await delay(1300);
	assert.equal(searches, 2);
});

test('명령 뒤 2초 안에 $state가 없으면 응답 없음, 다음 $state에 풀린다', async (t) => {
	const { scanner, connect } = await setup(t);
	const board = await connect();
	let silent = true;
	board.link('test', '#search', () => board.signal('#notify', board.cid));
	board.listen('@', () => { if (!silent) board.signal('@$state', 'on=1'); });
	board.signal('@$name', 'Lamp');
	board.signal('@$ui', 't=light.1');
	board.signal('@$state', 'on=0');
	await delay(30);
	scanner.search();
	await until(() => scanner.devices.get(board.cid)?.state, 'state');
	const device = scanner.devices.get(board.cid);

	scanner.command(board.cid, 'on');
	await delay(1500);
	assert.equal(device.unanswered, false, 'not before ANSWER_MS');
	await delay(700);
	assert.equal(device.unanswered, true);

	silent = false;
	scanner.command(board.cid, 'on');
	await until(() => device.state === 'on=1', 'answer');
	assert.equal(device.unanswered, false);
	await delay(2100);
	assert.equal(device.unanswered, false, 'an answered command is not marked');
});

test('search({ check: true })는 보이는 장치에 ?를 보내고 답이 없는 장치를 표시한다', async (t) => {
	const { scanner, connect } = await setup(t);
	const live = await connect();
	const dead = await connect();
	const received = [];
	for (const board of [live, dead]) {
		board.link('test', '#search', () => board.signal('#notify', board.cid));
		board.signal('@$name', board === live ? 'Live' : 'Dead');
		board.signal('@$ui', 't=light.1');
		board.signal('@$state', 'on=0');
	}
	live.listen('@', (tag, command) => { received.push(command); live.signal('@$state', 'on=0'); });
	await delay(30);
	scanner.search();
	await until(() => scanner.devices.get(live.cid)?.state && scanner.devices.get(dead.cid)?.state, 'both shown');

	scanner.search({ check: true });
	await delay(2200);
	assert.deepEqual(received, ['?']);
	assert.equal(scanner.devices.get(live.cid).unanswered, false);
	assert.equal(scanner.devices.get(dead.cid).unanswered, true);
});
