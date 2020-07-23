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

  const updateUI = async (state)=>{
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
  }

  useEffect(async () => {
    try {
      console.log("App loading");
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
      <header className="App-header">
        <img src={imageUrl} className="App-logo" alt="logo" />
        <p>
          You have <code>{closerStatus.tabCount}</code> opened.
        </p>
        <p>{closerStatus.closerStatus}</p>
        <a className="App-link" href="https://happyness.design">
          Learn how to be more positively productive ^-^
        </a>
      </header>
    </div>
  );
}

export default App;
