# compact-state

A Claude Code plugin. After `/compact` (or auto-compact), the session is told where its own state file is, so it keeps its place.

## Install (two commands, about 20 seconds)

```
/plugin marketplace add BrijeshParmar/compact-state-skill
/plugin install compact-state@compact-state
```

Needs Node.js on your PATH (Claude Code already uses it for many setups). Your `settings.json` is not touched.

## Uninstall

```
/plugin uninstall compact-state@compact-state
/plugin marketplace remove compact-state
```

Optional: delete `~/.claude/state/` to remove the state files it pointed at.

## What it does

After each compaction it prints one line into the session's context:

- State file exists: "read `~/.claude/state/<session_id>.md` first and treat it as your current state."
- No state file: "create it now with four sections: State now; Decisions (each written verbatim, with who said it and the date); IDs and paths; Next. Then append one line per step."

Example after a compaction in session `abc`:

```
After compaction: no state file yet. Create /home/you/.claude/state/abc.md now with four sections: State now; Decisions ...
```

## What it does not do

- It does not write the state file itself. The session does, when told to.
- It does not save or restore the conversation. Only what the session wrote to the file survives.
- It does not run on any event other than a compaction.
- No telemetry, no network access. The script only reads its stdin and creates `~/.claude/state/`.
- A broken or empty hook payload does not fail your session; the id falls back to `unknown`. Session ids are reduced to letters, digits, `_` and `-` before becoming a file name.

## Develop

```
npm test
```

MIT licensed.
