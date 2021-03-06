import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [closerStatus, setCloserStatus] = useState({
    closer: "",
    hp: 0,
    closerStatus: "",
    tabCount: 0,
  });

  const getStorage = () => {
    return new Promise((resolve, reject) => {
      window.chrome.storage.local.get(`closer`, (data) => {
        if (typeof data.closer !== `undefined`) {
          resolve(data.closer);
        } else {
          reject("no data was found");
        }
      });
    });
  };

  const updateUI = async (state) => {
    const randIndex = Math.floor(Math.random() * 20);
    let searchWord = "sun";
    if (state.hp === 100) {
      // monster is full health
      searchWord = "health";
    } else if (state.hp <= 99 && state.hp >= 80) {
      // monster is content
      searchWord = "content";
    } else if (state.hp <= 79 && state.hp >= 60) {
      // monster is irritated
      searchWord = "irritated";
    } else if (state.hp <= 59 && state.hp >= 40) {
      // monster is angry
      searchWord = "angry";
    } else if (state.hp <= 39 && state.hp >= 20) {
      // monster is sick
      searchWord = "sick";
    } else if (state.hp <= 19 && state.hp >= 1) {
      // monster is dying
      searchWord = "dying";
    } else if (state.hp <= 0) {
      // monster is dead (RIP)
      //TODO: CHANGE THIS TO STATE 6
      searchWord = "RIP";
    }

    const jsonRequest = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=Vhj4EBJBldBpxaRX5M18IHEy5hcI0phk&q=${searchWord}&limit=20&offset=0&rating=g&lang=en`
    );
    const jsonData = await jsonRequest.json();
    setImageUrl(jsonData.data[randIndex].images.original.url);
    setCloserStatus(state);
  };

  useEffect(async () => {
    setImageUrl("https://happyness.design/Sun_balloon_happyness.png");
    try {
      const state = await getStorage();
      updateUI(state);
    } catch (error) {
      console.log("there is not state in local storage", error.message);
    }
    window.chrome.storage.onChanged.addListener(async (changes, areaName) => {
      const state = changes.closer.newValue;
      updateUI(state);
    });
  }, []);

  return (
    <div className="App">
      <div className="logo-container">
        <img src="./HBD-logo.svg" alt="logo"></img>
      </div>
      <header className="App-header">
        <div class={`meter ${closerStatus.hp<50?"orange":""} ${closerStatus.hp<20?"red":""}`}>
          {closerStatus.hp>50?<div className="emoji">😍</div>:null}
          {closerStatus.hp<50 && closerStatus.hp>20?<div className="emoji">😥</div>:null}
          {closerStatus.hp<20?<div className="emoji">😭</div>:null}
          <span style={{ width: `${closerStatus.hp}%` }}></span>
        </div>
        <p>
          You have <code>{closerStatus.tabCount}</code> opened.
        </p>
        <p>{closerStatus.closerStatus}</p>
        <img src={imageUrl} className="App-logo" alt="Image" />

        <a className="App-link" href="https://happyness.design">
          Learn tips, tricks and hacks to be more positively productive ^_^
        </a>
      </header>
    </div>
  );
}

export default App;
