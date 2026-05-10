/*
  File    : urls.js
  Fungsi  : Daftar URL target untuk popup CuedNub Ai
  Lokasi  : config/urls.js
  Versi   : 0.4

  Cara tambah URL baru:
  1. Tambah object baru di array URL_TARGETS
  2. Update host_permissions di manifest.json
  3. Update content_scripts matches di manifest.json
*/

const URL_TARGETS = [
  {
    id: "arena",
    label: "Arena.ai",
    url: "https://arena.ai"
  },
  {
    id: "gemini",
    label: "Gemini",
    url: "https://gemini.google.com"
  }
];

const DEFAULT_TARGET = "arena";
