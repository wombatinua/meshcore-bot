# Meshcore Bot

Simple browser-based chat logger and echo-reply bot that connects over Bluetooth to the [Meshcore](https://meshcore.co.uk/) Companion device ([BLE firmware](https://github.com/meshcore-dev/MeshCore/releases)).

## What it does

- Connects to Meshcore Companion device
- Displays log of messages sent to connected Meshcore node
- Automatically replies to sender contact node with the same message (echo-reply)
- Displays log of channel messages it has access to (channel log)

This can be useful for testing mesh ranges without flooding a public channel with ping/pong traffic: one device stays connected to the browser as a logger while another roams, sends pings, and receives the bot’s echo replies.

The `preinstall` script clones the [`meshcore.js`](https://github.com/meshcore-dev/meshcore.js) repository locally for development and reference purposes.

## Prerequisites

Install `git`, [Node.js](https://nodejs.org/), and use a browser with Web Bluetooth support (Chrome or Edge on desktop).

## Quick start

```
git clone https://github.com/wombatinua/meshcore-bot.git
cd meshcore-bot
npm install
npm run build
npm run server
```

After the local server starts, open http://127.0.0.1:8080 in a Web Bluetooth capable browser.

## Available npm actions

- `npm install` — Install build dependencies
- `npm run build` – Bundle `meshcore-bot.js` with esbuild, producing a minified `bundle.js`
- `npm run build:watch` – Bundle `meshcore-bot.js` with esbuild, producing a minified `bundle.js` whenever sources change
- `npm run server` – Serve project directory with `http-server` (CORS enabled)
