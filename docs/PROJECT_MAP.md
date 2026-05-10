# PROJECT MAP — CuedNub Ai

## Informasi Proyek
- Nama: CuedNub Ai
- Versi: 0.4.0
- Tipe: Google Chrome Extension (Manifest V3)
- Fungsi: Popup manager untuk membuka Arena AI dan Gemini dengan kontrol keyboard, context menu, dan tema custom
- Repo: git@github.com:CuedNub/cuednub-ai.git
- Lokasi lokal PC: ~/Documents/chrome-extensions/cuednub-ai
- Branch Git: master

## Struktur Folder
- manifest.json
- config/urls.js
- docs/PROJECT_MAP.md
- docs/CHANGELOG.md
- js/background.js
- js/hint.js

## manifest.json
- fungsi: konfigurasi utama extension
- versi manifest: V3
- versi extension: 0.4.0
- permissions:
  - storage
  - contextMenus
  - tabs
- host_permissions:
  - https://arena.ai/*
  - https://*.arena.ai/*
  - https://gemini.google.com/*
- commands:
  - minimize-popup
  - restore-popup
- content_scripts:
  - js/hint.js untuk arena.ai dan gemini.google.com
- status: aktif

## config/urls.js
- fungsi: daftar URL target untuk popup
- versi: 0.4
- isi:
  - arena = https://arena.ai
  - gemini = https://gemini.google.com
- default target:
  - arena
- cara tambah URL baru:
  - tambah object di array URL_TARGETS
  - update host_permissions di manifest.json
  - update content_scripts matches di manifest.json
- status: aktif

## js/background.js
- fungsi: popup manager dengan context menu dan pilihan tema
- versi: 0.8
- fitur:
  - Klik kanan icon:
    - Arena.ai = buka/ganti popup ke arena.ai
    - Gemini = buka/ganti popup ke gemini
    - Tema: Cyan Outline
    - Tema: Hacker Green
    - Minimize
    - Restore
  - Klik kiri icon:
    - restore popup terakhir
    - atau buka popup default jika belum ada
  - Shortcut:
    - minimize-popup
    - restore-popup
  - Popup manager:
    - popup hanya satu sepanjang waktu
    - pilih target lain = URL popup diganti, bukan buat baru
    - window ID dan tab ID disimpan di chrome.storage.local
    - URL terakhir disimpan untuk restore
  - Tema:
    - tema terpilih disimpan di chrome.storage.local
    - mengirim pesan ke tab popup untuk ganti tema langsung
- dependensi:
  - manifest.json
  - config/urls.js via importScripts
- status: aktif

## js/hint.js
- fungsi: mode system, hint mode, scroll keyboard, mode indicator, CSS injection multi-tema
- versi: 1.0
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
  - Tema:
    - Cyan Outline
      - background tidak diubah
      - teks utama: #C4F1F9
      - teks sekunder: #97D9E1
      - border: #2D9CDB
      - aksen: #0BC5EA
    - Hacker Green
      - background tidak diubah
      - teks utama: #33FF33
      - teks sekunder: #20CC20
      - border: #1A8C1A
      - aksen: #00FF00
    - tema terakhir dimuat dari storage saat halaman dibuka
    - tema bisa diganti langsung lewat pesan dari background.js
  - Tampilan hint:
    - hint marker tetap kuning agar jelas
    - hint status tetap gelap dengan teks putih
- dependensi:
  - manifest.json sebagai content_scripts
- target:
  - halaman arena.ai
  - halaman gemini.google.com
- status: aktif

## Tema Aktif
- pilihan tema:
  - Cyan Outline
  - Hacker Green
- default tema saat ini:
  - Hacker Green
- cara ganti tema:
  - klik kanan icon CuedNub Ai
  - pilih Tema: Cyan Outline atau Tema: Hacker Green

## Shortcut
- Start popup:
  - klik kiri icon CuedNub Ai untuk restore popup terakhir
  - atau klik kanan icon lalu pilih target
- Minimize:
  - shortcut diatur manual di chrome://extensions/shortcuts
  - atau klik kanan icon lalu pilih Minimize
- Restore:
  - shortcut diatur manual di chrome://extensions/shortcuts
  - atau klik kanan icon lalu pilih Restore
- Hint Mode:
  - tekan F di halaman target saat mode NORMAL
- Keluar hint atau insert:
  - tekan Esc

## Catatan Penting
- Shortcut diatur manual di chrome://extensions/shortcuts
- Chrome extension API tidak mendukung always on top
- Popup memakai minimize/restore, bukan toggle
- Window ID disimpan di storage untuk mencegah duplikasi window
- Scroll target otomatis mencari elemen scrollable yang benar
- Background website tidak diubah oleh tema custom
- CSS injection saat ini fokus pada teks, border, aksen, dan scrollbar
- Popup hanya satu, URL bisa diganti via context menu
- Tema default saat ini adalah Hacker Green
