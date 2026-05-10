# CHANGELOG — CuedNub Ai

## v0.4.1
- menambahkan 2 pilihan tema di context menu:
  - Tema: Cyan Outline
  - Tema: Hacker Green
- memperbarui js/background.js:
  - menyimpan tema terpilih ke chrome.storage.local
  - mengirim pesan ke popup untuk ganti tema langsung
- memperbarui js/hint.js:
  - mendukung multi-tema
  - memuat tema terakhir dari storage saat halaman dibuka
  - menerima pesan perubahan tema dari background.js
- menetapkan Hacker Green sebagai tema default
- tema custom tetap tidak mengubah background website
- tema custom fokus pada:
  - teks
  - border
  - aksen
  - scrollbar
- Hint Mode tetap terlihat jelas setelah sistem tema ditambahkan

## v0.4.0
- menambahkan popup manager berbasis context menu
- klik kanan icon extension sekarang menampilkan:
  - Arena.ai
  - Gemini
  - Minimize
  - Restore
- popup utama sekarang hanya satu
- jika target diganti, popup yang sama dipakai ulang dan URL diperbarui
- menambahkan file config/urls.js untuk daftar URL target
- menambahkan target:
  - arena.ai
  - gemini.google.com
- memperbarui manifest.json:
  - tambah permission contextMenus
  - tambah permission tabs
  - tambah host_permissions untuk Gemini
- memperbarui js/background.js:
  - context menu aktif
  - klik kiri icon = restore popup terakhir
  - minimize dan restore tetap didukung
  - state popup disimpan di storage
- memperbarui js/hint.js:
  - menambahkan CSS injection custom
  - sempat diuji tema background gelap penuh
  - final dipilih mode Cyan Outline
- tema final pada tahap ini:
  - background tidak diubah
  - teks diubah ke cyan muda
  - border diubah ke cyan/biru
- memperbaiki Hint Mode agar marker dan status tetap terlihat jelas
- mempertahankan fitur lama:
  - Mode NORMAL
  - Mode INSERT
  - Mode HINT
  - scroll keyboard
  - hint untuk input box
  - minimize/restore popup

## v0.3.0
- menambahkan Hint Mode ala qutebrowser
- menampilkan label huruf di elemen clickable
- menambahkan dukungan hint untuk input, textarea, dan contenteditable
- menambahkan Mode System:
  - NORMAL
  - INSERT
  - HINT
- menambahkan Mode Indicator di kanan bawah
- menambahkan scroll keyboard:
  - j
  - k
  - d
  - u
  - gg
  - G
- memperbaiki deteksi target scroll di arena.ai

## v0.2.0
- mengubah kontrol popup menjadi:
  - klik icon = Start
  - shortcut terpisah = Minimize
  - shortcut terpisah = Restore + Focus
- menghapus model toggle tunggal karena kurang stabil
- menyimpan window ID di chrome.storage.local
- mencegah Restore membuka window duplikat
- menyesuaikan shortcut agar diatur manual di chrome://extensions/shortcuts

## v0.1.0
- membuat struktur awal extension Manifest V3
- membuat popup window untuk membuka arena.ai
- berhasil load unpacked extension di Chrome
- berhasil menampilkan arena.ai di popup
- menguji prototype popup muncul dan tertutup
- menemukan konflik shortcut Alt+Shift+A dengan Windows
