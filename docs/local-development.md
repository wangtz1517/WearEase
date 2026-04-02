# Local Frontend Debugging

This project no longer needs `file://.../index.html` for daily debugging.

Use a local static server instead:

```powershell
node scripts/local-dev-server.js
```

Or on Windows, double-click:

```text
start-local-web.bat
```

Default local URL:

```text
http://127.0.0.1:3000
```

## What This Server Does

- Serves the local frontend files over `http://localhost`
- Keeps browser behavior closer to GitHub Pages
- Still uses the same online Supabase project, auth, storage, and Edge Function

## Typical Workflow

1. Sync this project folder to the computer you want to use.
2. Make sure Node.js is installed on that computer.
3. Start the local frontend server.
4. Open `http://127.0.0.1:3000`.
5. Sign in and debug normally.

## Stop The Server

Press `Ctrl + C` in the terminal window.

## Optional Host Or Port

Change the port:

```powershell
$env:PORT=3100
node scripts/local-dev-server.js
```

Expose to your LAN:

```powershell
$env:HOST="0.0.0.0"
node scripts/local-dev-server.js
```

When `HOST=0.0.0.0`, the script will also print LAN URLs.
