# Twitch Streamer HUD

Run ``npm run tauri dev``.

### Planned Updates:

- chat displays emojis
- settings:
  - auto-clear messages

### Updated and/or In Testing:

- ~~chat automatically doesn't display "ai viewers" from non-followers~~
  - the below kinda covers that?
- remove messages that get removed from Twitch chat (on twitch-end)
  - this works for individual deletes. ban-deletes still in testing.
- holds Content Widget edits when Interact mode turns off