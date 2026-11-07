import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { message } from '../hooks/compact-state.mjs';

const home = () => mkdtempSync(join(tmpdir(), 'cs-'));

test('file missing: says create, names the path', () => {
  const h = home();
  const m = message('{"session_id":"abc","cwd":"/x"}', h);
  assert.match(m, /no state file yet\. Create .*abc\.md/);
  assert.ok(m.includes(join(h, '.claude', 'state', 'abc.md')));
});

test('file present: says read it', () => {
  const h = home();
  mkdirSync(join(h, '.claude', 'state'), { recursive: true });
  writeFileSync(join(h, '.claude', 'state', 'abc.md'), 'x');
  assert.match(message('{"session_id":"abc"}', h), /read .*abc\.md first/);
});

test('empty input: uses unknown, no throw', () => {
  assert.match(message('', home()), /unknown\.md/);
});

test('broken JSON: uses unknown, no throw', () => {
  assert.match(message('{nope', home()), /unknown\.md/);
});

test('path traversal in session_id stays inside the state dir', () => {
  const h = home();
  const m = message('{"session_id":"../../evil"}', h);
  assert.ok(m.includes(join(h, '.claude', 'state', 'evil.md')));
  assert.ok(!m.includes('..'));
  assert.deepEqual(readdirSync(join(h, '.claude')), ['state']);
});

test('unwritable state dir does not throw', () => {
  const h = home();
  writeFileSync(join(h, '.claude'), 'a file, so mkdir fails');
  assert.match(message('{"session_id":"abc"}', h), /Create/);
});
