# PROJECT MAP — CuedNub Ai

## Informasi Proyek
- Nama: CuedNub Ai
- Versi: 0.3.0
- Tipe: Google Chrome Extension (Manifest V3)
- Fungsi: Popup window untuk membuka arena.ai dengan kontrol keyboard
- Repo: git@github.com:CuedNub/cuednub-ai.git
- Lokasi lokal PC: /c/Users/ruspi/Documents/chrome-extensions/cuednub-ai

## Struktur Folder
- manifest.json
- docs/PROJECT_MAP.md
- docs/CHANGELOG.md
- js/background.js
- js/hint.js

## manifest.json
- fungsi: konfigurasi utama extension
- versi manifest: V3
- permissions: storage
- host_permissions:
  - https://arena.ai/*
  - https://*.arena.ai/*
- commands:
  - minimize-arena-popup
  - restore-arena-popup
- content_scripts:
  - js/hint.js untuk arena.ai
- status: aktif

## js/background.js
- fungsi: mengatur popup window arena.ai
- versi: 0.6
- fitur:
  - Start popup dengan klik icon extension
  - Minimize popup dengan shortcut
  - Restore + fokus popup dengan shortcut
  - Window ID disimpan di chrome.storage.local
- dependensi:
  - manifest.json
- status: aktif

## js/hint.js
- fungsi: mode system, hint mode, scroll keyboard, mode indicator
- versi: 0.5
- fitur:
  - Mode NORMAL
    - j = scroll bawah sedikit
    - k = scroll atas sedikit
    - d = scroll bawah setengah halaman
    - u = scroll atas setengah halaman
    - gg = scroll ke paling atas
    - G = scroll ke paling bawah
    - F = aktifkan hint mode
  - Mode HINT
    - mendeteksi elemen clickable termasuk input, textarea, dan contenteditable
    - label huruf muncul di atas elemen
    - ketik huruf untuk klik
    - Backspace untuk hapus input hint
    - Esc untuk batal
  - Mode INSERT
    - aktif saat fokus di input, textarea, atau contenteditable
    - keyboard normal untuk mengetik
    - Esc untuk kembali ke NORMAL
  - Mode Indicator
    - posisi: kanan bawah
    - NORMAL: hijau
    - INSERT: kuning
    - HINT: biru
- dependensi:
  - manifest.json sebagai content_scripts
- target:
  - halaman arena.ai
- status: aktif

## Shortcut
- Start popup:
  - klik icon CuedNub Ai
- Minimize:
  - diatur manual di chrome://extensions/shortcuts
- Restore:
  - diatur manual di chrome://extensions/shortcuts
- Hint Mode:
  - tekan F di halaman arena.ai saat mode NORMAL
- Keluar hint atau insert:
  - tekan Esc

## Catatan Penting
- Shortcut Alt+Shift+A bentrok dengan Windows, jadi shortcut diatur manual
- Chrome extension API tidak mendukung always on top
- Popup memakai minimize/restore, bukan hide/show
- Window ID disimpan di storage untuk mencegah duplikasi window
- Scroll target otomatis mencari elemen scrollable yang benar
