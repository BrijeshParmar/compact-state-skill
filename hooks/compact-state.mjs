// SessionStart (matcher "compact"): tell the session where its own state file is.
// Never fails the session: bad input or an unwritable dir still prints a usable message.
import { existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export function message(input, home = homedir()) {
  let data = {};
  try { data = JSON.parse(input.trim() || '{}') ?? {}; } catch { /* broken JSON: fall back to defaults */ }
  const cwd = typeof data.cwd === 'string' ? data.cwd : '';
  // session_id becomes a file name: keep only safe characters so it cannot escape the state dir.
  const id = typeof data.session_id === 'string' ? data.session_id.replace(/[^\w-]/g, '') : '';
  const dir = join(home, '.claude', 'state');
  try { mkdirSync(dir, { recursive: true }); } catch { /* the model will hit the error itself when it writes */ }
  const file = join(dir, `${id || 'unknown'}.md`);
  return existsSync(file)
    ? `After compaction: read ${file} first and treat it as your current state. Keep appending one line per step.`
    : `After compaction: no state file yet. Create ${file} now with four sections: State now; Decisions (write each one verbatim, with who said it and the date); IDs and paths; Next. cwd ${cwd}. Then append one line per step so the next compaction loses nothing.`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  console.log(message(raw));
}
