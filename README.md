# GitHub Notifications (Firefox Add-on)

> 🚧 **Status: WIP** – usable already, but still evolving and not yet feature-complete.

## What it does

- Polls your GitHub notifications (`/notifications`) via the GitHub API on a configurable interval
- Shows unread notifications as desktop notifications
- Clicking a notification opens the related issue/PR in a browser tab using the GitHub cookie context
- Remembers already-seen notifications to avoid duplicate alerts

## Requirements

- Firefox ≥ 112
- A [GitHub Personal Access Token](https://github.com/settings/tokens) with access to `notifications`, to be entered in the add-on settings

## Usage (development)

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click **Load Temporary Add-on…**
3. Select the `manifest.json` file from this repository

The add-on stays loaded until Firefox is restarted.

Then set your GitHub Access Token and poll interval in the add-on's options page.

## Known limitations

- No official release yet / not published on the Firefox Add-on store
- The token is currently stored unencrypted in the extension's local storage (`browser.storage.local`) — it stays on your device and is not synced or uploaded anywhere, but it is not protected against other local access
