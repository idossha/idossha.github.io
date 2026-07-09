# Home Server — Tailscale + Syncthing

Bidirectional file sync between a home Linux server and a macOS laptop over a private
encrypted network.

## Overview

The goal: keep files in sync between a Raspberry Pi server at home and a MacBook,
reliably, even when networks change (coffee shop Wi-Fi, campus networks, university
VPN, CGNAT at home). The setup has two layers:

- **Tailscale**: gives both machines a private, authenticated, encrypted network (WireGuard-based), so they can always reach each other.
- **Syncthing**: continuously syncs designated folders over that network. Files exist as true local copies on both machines — no mounts, no kernel extensions, no stale connections.

## Why this approach

- **Reliability**: Syncthing reconnects automatically after network changes. No stale mounts, no watchdog scripts.
- **No kernel extensions**: unlike SSHFS/macFUSE, Syncthing runs entirely in userspace.
- **VPN resilience**: using Tailscale IPs (not DNS names) ensures connectivity survives university VPN (GlobalProtect) disruptions.
- **True local files**: files exist on both machines. Editors, scripts, and Finder work normally even when offline.
- **Bidirectional sync**: changes on either side propagate to the other automatically.
- **Security**: all traffic is encrypted end-to-end via both Tailscale (WireGuard) and Syncthing (TLS).

## Previous approach (SSHFS)

The original setup used SSHFS + macFUSE to mount the Pi's storage as a local directory
on the Mac, with a watchdog script to detect and recover broken mounts. This was
retired because:

- macFUSE kernel extensions became increasingly problematic on modern macOS.
- The university VPN (GlobalProtect) frequently disrupted Tailscale, causing the mount to go stale.
- Recovery required manual intervention or a complex watchdog with exponential backoff.
- Files weren't truly local — any network hiccup meant editors and scripts would hang.

## Architecture

```
MacBook (~/homelab/)
    |
    |  Syncthing (port 22000)
    |  over Tailscale private network
    |
Raspberry Pi (/media/idohaber/storage)

Mac  Tailscale IP: (run `tailscale ip -4`)
Pi   Tailscale IP: <pi-tailscale-ip>
```

Both devices are on the same Tailscale network. Syncthing connects using Tailscale IPs
directly, bypassing DNS resolution issues caused by VPN interference.

## Prerequisites

- **Raspberry Pi**: Linux server with sudo access and an external storage drive mounted.
- **MacBook**: macOS with Homebrew installed.
- **Tailscale**: both devices authorized on the same tailnet.
- **SSH keys**: an SSH keypair on the Mac for remote administration (recommended: Ed25519).

Generate an SSH key (macOS):

```
ssh-keygen -t ed25519 -a 64 -C "homelab-mac"
```

## Step 1 — Tailscale setup

On the Pi, after install:

```
sudo tailscale up
tailscale status
tailscale ip -4
```

On macOS, install the Tailscale app and log into the same tailnet. Confirm connectivity:

```
ping <pi-tailscale-ip>
ssh <user>@<pi-tailscale-ip>
```

> **Tip:** Use the Tailscale IP rather than MagicDNS names. This avoids DNS resolution
> failures when the university VPN is active.

## Step 2 — SSH hardening (Pi)

SSH is used for remote administration, not file sync. Still worth hardening.

```
sudo apt-get update
sudo apt-get install -y openssh-server
sudo systemctl enable --now ssh
```

Add your Mac's public key, then set recommended `sshd_config`:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
```

Then `sudo systemctl restart ssh`.

## Step 3 — Syncthing on macOS

```
brew install syncthing
# If using the dotfiles repo, stow the launchd plist
cd ~/.dotfiles && stow syncthing
launchctl load ~/Library/LaunchAgents/com.idohaber.syncthing.plist
```

Open the web UI at `http://localhost:8384` and note your **Device ID** (Actions › Show
ID) — you'll need it when pairing with the Pi. A control script is included in the
dotfiles at `bin/syncthing-ctl.sh` (`status`, `start`, `stop`, `restart`, `open`, `log`,
`setup-pi`).

## Step 4 — Syncthing on the Pi

```
sudo apt update && sudo apt install -y syncthing
sudo systemctl enable syncthing@idohaber
sudo systemctl start syncthing@idohaber
```

The Pi's Syncthing UI listens on localhost only, so access it via an SSH tunnel:

```
ssh -L 8385:localhost:8384 raspberrypi
```

Then open `http://localhost:8385`. Port 8385 is used because 8384 is already taken by
the Mac's Syncthing.

## Step 5 — Pairing devices and sharing folders

Exchange device IDs (Actions › Show ID on each UI), add each machine as a remote device
using `tcp://<tailscale-ip>:22000` as the address, then share a folder from the Pi
(`/media/idohaber/storage`) to the Mac (`/Users/idohaber/homelab`).

> **Important:** The Folder ID must be identical on both devices. This is what links
> them. The folder label can differ.

## Day-to-day usage

Syncthing runs in the background on both machines. No manual intervention needed. Files
placed in the sync folder on either machine appear on the other automatically.

## Troubleshooting

- **Sync not working after VPN reconnect**: give it a minute, then check `syncthing-ctl.sh status`.
- **Devices show "Disconnected"**: verify Tailscale is connected on both sides; check that addresses use Tailscale IPs.
- **Folder not syncing**: ensure the Folder ID matches exactly on both devices.
- **Conflict files**: Syncthing creates `.sync-conflict-*` files when both sides change the same file simultaneously. Resolve manually.
