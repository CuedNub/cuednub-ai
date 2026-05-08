# CHANGELOG — CuedNub Ai

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
