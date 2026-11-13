# Deploying PETA PoC on the on-prem server

A step-by-step guide for a first deployment. Copy each command, run it, and compare the output with what the guide says you should see.

**End result:** anyone on the office network opens **`http://<server-ip>:8016/peta-poc`** and sees the app.

---

## 0. The idea in one picture

```
 Your laptop / browser                      The server
 ─────────────────────                      ──────────────────────────────────────────
                                            ┌──────────────────────────────────────┐
 http://<server-ip>:8016/peta-poc  ───────► │ port 8016  (the server's "door")     │
                                            │    │                                 │
                                            │    │  Docker forwards it to ...      │
                                            │    ▼                                 │
                                            │ ┌─────────── container ────────────┐ │
                                            │ │ app listens on port 3000         │ │
                                            │ │ app lives under /peta-poc        │ │
                                            │ └──────────────────────────────────┘ │
                                            └──────────────────────────────────────┘
```

Three words you'll see:

| Word | Meaning here |
|---|---|
| **Image** | The packaged app, like an installer. You *build* it once. |
| **Container** | A running copy of the image, like the installed program running. |
| **Port forwarding** (port mapping) | Connecting a door on the server (**8016**) to the door inside the container (**3000**). It's the line `"8016:3000"` in `compose.yaml`: **left = server, right = container**. You only ever change the left number. |

Port 3000 is *inside* the container, so it can't clash with another app on the server that also uses 3000. Only the left number (8016) has to be free on the server.

**`/peta-poc` is the app name in the URL.** It's set in `next.config.ts` (`BASE_PATH`). Because of it, `http://<server-ip>:8016/` (no name) shows a 404 page. That's expected.

---

## 1. Before you go to the server (on your laptop)

The server gets the code from GitHub, so push your latest changes first:

```bash
cd web
git add -A
git commit -m "Serve app under /peta-poc on port 8016"
git push
```

---

## 2. Log in to the server

```bash
ssh <your-user>@<server-ip>
```

Check that Docker and Docker Compose are installed:

```bash
docker --version          # want: Docker version 23 or newer
docker compose version    # want: Docker Compose version v2.x
```

- `command not found` → ask the server admin to install Docker Engine with the Compose plugin.
- `permission denied ... docker.sock` → put `sudo` in front of every `docker` command in this guide, or ask the admin to add you to the `docker` group.
- Only `docker-compose` (with a dash) works → that's the old v1. Ask for the Compose v2 plugin; v1 can't read this compose file.

---

## 3. Make sure nothing will clash (the important part)

Run all three checks. Each one should come back **empty**.

### 3a. Is port 8016 already in use?

```bash
sudo ss -tlnp | grep ':8016 '
```

- **No output** → 8016 is free. Go on.
- **A line appears** → something already uses 8016. **Stop and ask your friend.** It may be a shared web server (nginx) that is meant to send `/peta-poc` to your app. In that case, follow [section 9](#9-if-port-8016-belongs-to-a-shared-nginx) instead.

### 3b. Is the container name `peta-poc` already taken?

```bash
docker ps -a --filter name=peta-poc
```

- **Only the header line** → free.
- **A `peta-poc` row appears** → an old copy exists, maybe from an earlier attempt. If it's yours, remove it: `docker rm -f peta-poc`. If it isn't yours, ask first.

### 3c. Does someone else's project already use the name `peta-poc`?

```bash
docker compose ls
```

- No `peta-poc` row → free. (Our `compose.yaml` sets `name: peta-poc`, so it never mixes with other people's projects even if their folder is also called `web`.)

---

## 4. Get the code onto the server

The first time:

```bash
cd ~
git clone https://github.com/Ridhoalharits/peta-poc.git
cd peta-poc
```

If it's a private repo, Git asks for a username and password. Use your GitHub username and a **Personal Access Token** as the password (GitHub → Settings → Developer settings → Personal access tokens).

Every later time (updating):

```bash
cd ~/peta-poc
git pull
```

---

## 5. Build and start

From inside the project folder (the one that has `Dockerfile` and `compose.yaml`):

```bash
docker compose up -d --build
```

What this does: builds the image (first time: about 2–5 minutes) and starts the container in the background (`-d`). It restarts by itself after a crash or a server reboot.

The build needs internet access (to download packages from npm and fonts from Google). If it fails with `ETIMEDOUT`, `ENOTFOUND` or `fetch failed`, the server is probably behind a company proxy. See [Troubleshooting](#8-troubleshooting).

---

## 6. Check that it's running

```bash
docker ps --filter name=peta-poc
```

Wait about 20 seconds and run it again. You want to see:

```
NAMES      STATUS                    PORTS
peta-poc   Up 30 seconds (healthy)   0.0.0.0:8016->3000/tcp
```

- `(health: starting)` → wait a bit more.
- `(unhealthy)` or `Restarting` → look at the logs: `docker logs peta-poc`

Test from the server itself:

```bash
curl -I http://localhost:8016/peta-poc/talent-recommendation
```

You want `HTTP/1.1 200 OK`.

---

## 7. Open it from your laptop

In the browser: **`http://<server-ip>:8016/peta-poc`**

It should jump to the Talent Recommendation list.

If it works on the server (step 6) but **not** from your laptop, the server's firewall is blocking 8016. Open it:

```bash
# Ubuntu / Debian
sudo ufw allow 8016/tcp

# RHEL / CentOS / Rocky
sudo firewall-cmd --permanent --add-port=8016/tcp
sudo firewall-cmd --reload
```

Still blocked? There may be a network firewall between your laptop and the server. Ask IT to allow TCP **8016** to the server. (You only need router "port forwarding" if people **outside** the office network must reach it. For an internal PoC, you don't.)

---

## 8. Troubleshooting

| What you see | Why | Fix |
|---|---|---|
| `port is already allocated` / `address already in use` | Something else uses 8016 | Run step 3a. Pick another free port for a test: `HOST_PORT=8017 docker compose up -d`, then use `:8017` in the URL. Tell your friend. |
| `The container name "/peta-poc" is already in use` | An old container with the same name | `docker rm -f peta-poc`, then `docker compose up -d` |
| 404 page at `http://<server-ip>:8016/` | You left out the app name | Use `http://<server-ip>:8016/peta-poc` |
| Page loads but has no styling / no logo | Something in front (a proxy) removes `/peta-poc` from the URL | The proxy must pass the path through unchanged; see section 9 |
| Build fails: `ETIMEDOUT`, `ENOTFOUND`, `fetch failed` | No internet / company proxy | `docker compose build --build-arg HTTP_PROXY=http://<proxy>:<port> --build-arg HTTPS_PROXY=http://<proxy>:<port>`, then `docker compose up -d` |
| Build fails: `the --mount option requires BuildKit` | Old Docker | Run `DOCKER_BUILDKIT=1 docker compose up -d --build`, or ask for a newer Docker |
| `exec format error` | Image built on another type of machine | Always build **on the server**, as in step 5 |
| `permission denied ... docker.sock` | Your user can't use Docker | Add `sudo`, or ask the admin |

Useful everyday commands (run from the project folder):

```bash
docker ps --filter name=peta-poc   # is it running?
docker logs -f peta-poc            # watch the logs (Ctrl+C to stop watching)
docker compose restart             # restart the app
docker compose down                # stop and remove the container (the image stays)
```

Update to a new version:

```bash
cd ~/peta-poc
git pull
docker compose up -d --build       # rebuilds and swaps the container, ~1 minute downtime
docker image prune -f              # optional: delete old unused images to save disk
```

---

## 9. If port 8016 belongs to a shared nginx

Sometimes one web server (nginx) owns port 8016 and sends each app name to a different container, for example `:8016/app-a`, `:8016/peta-poc`. If step 3a showed nginx on 8016, that's your setup. Then:

1. **Don't** publish 8016 yourself. Start the app on a free internal port instead, for example 18016 (check it's free with `sudo ss -tlnp | grep ':18016 '`):

   ```bash
   HOST_PORT=18016 docker compose up -d --build
   ```

2. Ask whoever manages that nginx to add this block to the server listening on 8016, then reload nginx:

   ```nginx
   location /peta-poc {
       proxy_pass http://127.0.0.1:18016;   # no trailing slash: keep /peta-poc in the path
       proxy_set_header Host $host;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

   The app expects `/peta-poc` at the start of every URL, so nginx must **not** strip it. That's why there's no `/` at the end of `proxy_pass`.

3. Open `http://<server-ip>:8016/peta-poc` as usual.

---

## 10. Changing the app name or port later

| Change | Where | Then |
|---|---|---|
| The name in the URL (`/peta-poc`) | `BASE_PATH` in `next.config.ts`, and the health-check URL at the bottom of `Dockerfile` | Commit, push, `git pull` on the server, `docker compose up -d --build` |
| The server port (8016) | Left number in `compose.yaml` (`${HOST_PORT:-8016}`), or just `HOST_PORT=xxxx docker compose up -d` | No rebuild needed |
