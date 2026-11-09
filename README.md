# compact-state

A Claude Code plugin that, after every compaction, points your session at its notes file and asks it to create one if there is none, so the important things do not depend on the auto-summary.

## Why

Compaction writes its own summary of your session. If a decision, an ID or a file path matters, you may not want it to depend on whatever that summary kept. Keep those in a file you and the session own.

This plugin automates the small part: right after `/compact` or auto-compact, it tells the session to read that file, or to create it if there is none.

## Install (two commands, about 20 seconds)

```
/plugin marketplace add BrijeshParmar/compact-state-skill
/plugin install compact-state@compact-state
```

Needs Node.js on your PATH (Claude Code already uses it for many setups). Your `settings.json` is not touched.

## What the notes file holds

Four sections, in `~/.claude/state/<session_id>.md`:

- **State now**: what is done, what is running
- **Decisions**: each written verbatim, with who said it and the date
- **IDs and paths**: session ids, file paths, anything exact
- **Next**: the one next step

## What it does

After each compaction it prints one line into the session's context:

- State file exists: "read `~/.claude/state/<session_id>.md` first and treat it as your current state."
- No state file: "create it now with four sections: State now; Decisions (each written verbatim, with who said it and the date); IDs and paths; Next. Then append one line per step."

Example after a compaction in session `abc`:

```
After compaction: no state file yet. Create /home/you/.claude/state/abc.md now with four sections: State now; Decisions ...
```

## Tested

- Unit tests (`npm test`, 7 tests), and each fix was checked by reverting it and seeing a test fail.
- The two install commands above were run in a clean home directory: the plugin installed, was enabled, and uninstalled cleanly.
- A real `/compact` in one session, using the same script as a user-level hook rather than the plugin install: the session then wrote a notes file with the four headings and one decision, quoted, with who said it and the date. I checked the file by counts and headings, not by reading it.
- The hook cannot write the file. The session writes it on its next turn after the compaction.

This comes from one person's sessions. I have not seen how it behaves in other people's setups, so please open an issue if it does not do what is described here.

## What it does not do

- It does not write the state file itself. The session does, when told to.
- It does not save or restore the conversation. Only what the session wrote to the file survives.
- It does not run on any event other than a compaction.
- No telemetry, no network access. The script only reads its stdin and creates `~/.claude/state/`.
- A broken or empty hook payload does not fail your session; the id falls back to `unknown`. Session ids are reduced to letters, digits, `_` and `-` before becoming a file name.

## Uninstall

```
/plugin uninstall compact-state@compact-state
/plugin marketplace remove compact-state
```

Optional: delete `~/.claude/state/` to remove the state files it pointed at.

## Develop

```
npm test
```

MIT licensed.
