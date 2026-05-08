/*
  File    : background.js
  Fungsi  : Start, Minimize, Restore popup Arena AI
  Lokasi  : js/background.js
  Versi   : 0.6

  Catatan:
  - Window ID disimpan di chrome.storage.local
  - Ini mencegah shortcut Restore membuka window baru saat service worker reset
*/

let popupWindowId = null;

const STORAGE_KEY = "arenaPopupWindowId";
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 700;

// Klik icon = Start popup
chrome.action.onClicked.addListener(() => {
  startPopup();
});

// Shortcut commands
chrome.commands.onCommand.addListener((command) => {
  if (command === "minimize-arena-popup") {
    minimizePopup();
  } else if (command === "restore-arena-popup") {
    restorePopup();
  }
});

function savePopupWindowId(windowId, callback) {
  popupWindowId = windowId;
  chrome.storage.local.set({ [STORAGE_KEY]: windowId }, () => {
    if (callback) callback();
  });
}

function clearPopupWindowId(callback) {
  popupWindowId = null;
  chrome.storage.local.remove(STORAGE_KEY, () => {
    if (callback) callback();
  });
}

function resolvePopupWindowId(callback) {
  if (typeof popupWindowId === "number") {
    callback(popupWindowId);
    return;
  }

  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const savedId = result[STORAGE_KEY];

    if (typeof savedId === "number") {
      popupWindowId = savedId;
      callback(savedId);
    } else {
      callback(null);
    }
  });
}

function startPopup() {
  resolvePopupWindowId((windowId) => {
    if (windowId === null) {
      openPopup();
      return;
    }

    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        clearPopupWindowId(() => {
          openPopup();
        });
        return;
      }

      chrome.windows.update(windowId, {
        state: "normal",
        focused: true
      });
    });
  });
}

function openPopup() {
  chrome.windows.create({
    url: "https://arena.ai",
    type: "popup",
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT
  }, (win) => {
    if (chrome.runtime.lastError || !win) {
      console.error("Gagal membuat popup:", chrome.runtime.lastError);
      return;
    }

    savePopupWindowId(win.id);
  });
}

function minimizePopup() {
  resolvePopupWindowId((windowId) => {
    if (windowId === null) return;

    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        clearPopupWindowId();
        return;
      }

      chrome.windows.update(windowId, {
        state: "minimized"
      });
    });
  });
}

function restorePopup() {
  resolvePopupWindowId((windowId) => {
    if (windowId === null) {
      openPopup();
      return;
    }

    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        clearPopupWindowId(() => {
          openPopup();
        });
        return;
      }

      chrome.windows.update(windowId, {
        state: "normal",
        focused: true
      });
    });
  });
}

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    clearPopupWindowId();
    return;
  }

  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (result[STORAGE_KEY] === windowId) {
      clearPopupWindowId();
    }
  });
});
