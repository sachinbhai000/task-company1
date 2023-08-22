import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function CharacterCard({ showDelete, character, onClose, films, index }) {
  return (
    <div className="character-card">
      {showDelete && (
        <button className="close-button" onClick={() => onClose(character)}>
          x
        </button>
      )}
      <img
        src="https://cdn.shopify.com/s/files/1/1779/2423/files/cover_6216277b-d94f-4064-b9c3-5b1b59a61665.png?v=1676294822"
        alt="Character"
        className="character-image"
      />
      <h2>Name: {character.name}</h2>
      <h3>Height: {character.height}</h3>
      <h5>Films: {!films ? "fetching Names..." : films.join(", ")}</h5>
      {/* <p>Films :{character.films.join(', ')} </p> */}
    </div>
  );
}

function App() {
  const [characters, setCharacters] = useState([]);
  const [dispCharacters, setDispCharacters] = useState([]);
  const [dispFilms, setDispFilms] = useState([]);
  useEffect(() => {
    axios
      .get("https://swapi.dev/api/people/")
      .then((response) => {
        setCharacters(response.data.results);
        setDispCharacters(response.data.results.slice(0, 3));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const getdata = async (url) => {
    const response = await axios.get(url);
    return response.data.title;
  };

  const filmNames = async (urls) => {
    let films = [];
    for (let i = 0; i < urls.length; i++) {
      let name = await getdata(urls[i]);
      await films.push(name);
    }
    setDispFilms((prevCharacters) => [...prevCharacters, films]);
  };

  const handleAddCard = () => {
    if (characters.length > dispCharacters.length) {
      const nextCharacter = characters[dispCharacters.length];
      setDispCharacters((prevCharacters) => [...prevCharacters, nextCharacter]);
    }
  };

  const handleCloseCard = (characterToRemove) => {
    setDispCharacters((prevCharacters) =>
      prevCharacters.filter((character) => character !== characterToRemove)
    );
  };
  return (
    <div className="App">
      <h1
        style={{
          backgroundColor: "black",
          color: "white",
          fontFamily: "serif",
        }}
      >
        Star Wars Characters
      </h1>
      <div className="character-list">
        {dispCharacters.map(
          (character, index) =>
            filmNames(character.films) && (
              <CharacterCard
                key={index}
                character={character}
                showDelete={dispCharacters.length > 3 ? true : false}
                onClose={handleCloseCard}
                films={dispFilms[index]}
                index={index}
              />
            )
        )}
      </div>
      {dispCharacters.length < characters.length && (
        <button className="add-button" onClick={handleAddCard}>
          Add Card
        </button>
      )}
    </div>
  );
}

export default App;
