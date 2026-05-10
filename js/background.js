/*
  File    : background.js
  Fungsi  : Popup manager dengan context menu
  Lokasi  : js/background.js
  Versi   : 0.7

  Aksi:
  - Klik kanan icon → pilih Arena.ai / Gemini / Minimize / Restore
  - Klik kiri icon  → Restore popup terakhir (atau buka default)
  - Shortcut        → Minimize / Restore

  Aturan:
  - Popup hanya satu sepanjang waktu
  - Pilih target lain → URL popup diganti, bukan buat baru
  - Window ID dan tab ID disimpan di chrome.storage.local
*/

importScripts("../config/urls.js");

const STORAGE_KEY_WINDOW = "popupWindowId";
const STORAGE_KEY_TAB = "popupTabId";
const STORAGE_KEY_LAST_TARGET = "lastTarget";
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 700;

let popupWindowId = null;
let popupTabId = null;

// ========================================
// STORAGE
// ========================================

function saveState(windowId, tabId, targetId, callback) {
  popupWindowId = windowId;
  popupTabId = tabId;

  const data = {
    [STORAGE_KEY_WINDOW]: windowId,
    [STORAGE_KEY_TAB]: tabId
  };

  if (targetId) {
    data[STORAGE_KEY_LAST_TARGET] = targetId;
  }

  chrome.storage.local.set(data, () => {
    if (callback) callback();
  });
}

function clearState(callback) {
  popupWindowId = null;
  popupTabId = null;
  chrome.storage.local.remove([STORAGE_KEY_WINDOW, STORAGE_KEY_TAB], () => {
    if (callback) callback();
  });
}

function resolveState(callback) {
  if (typeof popupWindowId === "number" && typeof popupTabId === "number") {
    callback(popupWindowId, popupTabId);
    return;
  }

  chrome.storage.local.get([STORAGE_KEY_WINDOW, STORAGE_KEY_TAB], (result) => {
    const wId = result[STORAGE_KEY_WINDOW];
    const tId = result[STORAGE_KEY_TAB];

    if (typeof wId === "number" && typeof tId === "number") {
      popupWindowId = wId;
      popupTabId = tId;
      callback(wId, tId);
    } else {
      callback(null, null);
    }
  });
}

function getLastTarget(callback) {
  chrome.storage.local.get([STORAGE_KEY_LAST_TARGET], (result) => {
    callback(result[STORAGE_KEY_LAST_TARGET] || DEFAULT_TARGET);
  });
}

// ========================================
// URL HELPERS
// ========================================

function getUrlByTargetId(targetId) {
  const target = URL_TARGETS.find((t) => t.id === targetId);
  return target ? target.url : URL_TARGETS[0].url;
}

// ========================================
// CONTEXT MENU
// ========================================

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    for (const target of URL_TARGETS) {
      chrome.contextMenus.create({
        id: "open-" + target.id,
        title: target.label,
        contexts: ["action"]
      });
    }

    chrome.contextMenus.create({
      id: "separator-1",
      type: "separator",
      contexts: ["action"]
    });

    chrome.contextMenus.create({
      id: "minimize-popup",
      title: "Minimize",
      contexts: ["action"]
    });

    chrome.contextMenus.create({
      id: "restore-popup",
      title: "Restore",
      contexts: ["action"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const menuId = info.menuItemId;

  if (menuId === "minimize-popup") {
    minimizePopup();
    return;
  }

  if (menuId === "restore-popup") {
    restorePopup();
    return;
  }

  if (menuId.startsWith("open-")) {
    const targetId = menuId.replace("open-", "");
    openTarget(targetId);
  }
});

// ========================================
// KLIK KIRI ICON
// ========================================

chrome.action.onClicked.addListener(() => {
  resolveState((windowId, tabId) => {
    if (windowId === null) {
      getLastTarget((targetId) => {
        openTarget(targetId);
      });
      return;
    }

    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        clearState(() => {
          getLastTarget((targetId) => {
            openTarget(targetId);
          });
        });
        return;
      }

      chrome.windows.update(windowId, {
        state: "normal",
        focused: true
      });
    });
  });
});

// ========================================
// SHORTCUT COMMANDS
// ========================================

chrome.commands.onCommand.addListener((command) => {
  if (command === "minimize-popup") {
    minimizePopup();
  } else if (command === "restore-popup") {
    restorePopup();
  }
});

// ========================================
// POPUP MANAGER
// ========================================

function openTarget(targetId) {
  const url = getUrlByTargetId(targetId);

  resolveState((windowId, tabId) => {
    if (windowId === null) {
      createPopup(url, targetId);
      return;
    }

    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        clearState(() => {
          createPopup(url, targetId);
        });
        return;
      }

      chrome.tabs.update(tabId, { url: url }, () => {
        if (chrome.runtime.lastError) {
          clearState(() => {
            createPopup(url, targetId);
          });
          return;
        }

        chrome.storage.local.set({ [STORAGE_KEY_LAST_TARGET]: targetId });

        chrome.windows.update(windowId, {
          state: "normal",
          focused: true
        });
      });
    });
  });
}

function createPopup(url, targetId) {
  chrome.windows.create({
    url: url,
    type: "popup",
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT
  }, (win) => {
    if (chrome.runtime.lastError || !win) {
      console.error("Gagal membuat popup:", chrome.runtime.lastError);
      return;
    }

    const tabId = win.tabs && win.tabs[0] ? win.tabs[0].id : null;
    saveState(win.id, tabId, targetId);
  });
}

function minimizePopup() {
  resolveState((windowId) => {
    if (windowId === null) return;

    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        clearState();
        return;
      }

      chrome.windows.update(windowId, { state: "minimized" });
    });
  });
}

function restorePopup() {
  resolveState((windowId) => {
    if (windowId === null) {
      getLastTarget((targetId) => {
        openTarget(targetId);
      });
      return;
    }

    chrome.windows.get(windowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        clearState(() => {
          getLastTarget((targetId) => {
            openTarget(targetId);
          });
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

// ========================================
// CLEANUP
// ========================================

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    clearState();
    return;
  }

  chrome.storage.local.get([STORAGE_KEY_WINDOW], (result) => {
    if (result[STORAGE_KEY_WINDOW] === windowId) {
      clearState();
    }
  });
});
