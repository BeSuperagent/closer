'use strict';

const TIME_INTERVAL = 3600000;
const MAX_HEALTH = 100;
let evolutionInterval = undefined;
let globalState = {};

function getTabsCount() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      let tabCount = tabs.length > 0 ? tabs.length - 1 : 0;
      resolve(tabCount);
    });
  });
}

function getStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(`closer`, (data) => {
      if (typeof data.closer !== `undefined`) {
        globalState = data.closer;
        resolve(data.closer);
      } else {
          console.log("DEBUG: GETSTORAGE ELSE");
          const state = {
            hp: MAX_HEALTH,
            closer: ``,
            closerStatus: ``,
            tabCount: 0
          };

          getTabsCount().then(tabCount => {
            state.tabCount = tabCount;
            return chrome.storage.local.set({closer: state});
          }).then(() => {
            globalState = state;
            resolve(state);
          });
      }
    });
  });
}


function updateCloserState() {
  let state = {};

  getStorage().then(result => {
    state = result;
    return getTabsCount();
  }).then(tabCount => {
    state.tabCount = tabCount;
    state.hp = MAX_HEALTH - 4 * tabCount;

    let textArray = [];
    const randIndex = Math.floor(Math.random() * (3));
    if (state.hp === MAX_HEALTH) {
      state.closerStatus = `"Yippee!"`;
    } else if (state.hp <= 99 && state.hp >= 80) {
      textArray = [`"Oh yeah!"`,`"So happy!"`,`"Hi! Hello! Hi!"`];
      state.closerStatus = textArray[randIndex];
    } else if (state.hp <= 79 && state.hp >= 60) {
      textArray = [`"You are the best!"`,`"Life is good!"`,`"<3"`];
      state.closerStatus = textArray[randIndex];
    } else if (state.hp <= 59 && state.hp >= 40) {
      textArray = [`"Hmph!!!!!"`,`"Too. Many. Tabs."`,`"Please close tabs."`];
      state.closerStatus = textArray[randIndex];
    } else if (state.hp <= 39 && state.hp >= 20) {
      textArray = [`"So mad at you!"`,`"%(*$&%&"`,`"Argh!"`];
      state.closerStatus = textArray[randIndex];
    } else if (state.hp <= 19 && state.hp >= 1) {
      textArray = [`"Feeling sick..."`,`"Slipping away..."`,`"Stomachache..."`];
      state.closerStatus = textArray[randIndex];
    } else if (state.hp <= 0) {
      state.closerStatus = `"R.I.P."`;
    }

    chrome.storage.local.set({closer: state}, () => {
      globalState = state;
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  getStorage().then(state => {
    chrome.tabs.create({
       url: "index.html"
    });
  });
});

chrome.tabs.onCreated.addListener(() => {
  updateCloserState();
});

chrome.tabs.onRemoved.addListener(() => {
    updateCloserState();
});

chrome.tabs.onUpdated.addListener(() => {
    updateCloserState();
});
