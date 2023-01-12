import { useEffect, useState } from "react";
import { emulateTab } from "emulate-tab";
import fiveLetterWords from "./fiveLetterWords";

const randomAnswer = () => {
  return fiveLetterWords[
    Math.floor(Math.random() * fiveLetterWords.length)
  ].toUpperCase();
};
const letterStyle = {
  width: "20px",
  border: "1px solid black",
  margin: "5px",
  fontSize: "20px",
};
const emptyGuess = new Array(5).fill(null);

function App() {
  const [answer, setAnswer] = useState(randomAnswer());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(emptyGuess);
  const [keyboard, setKeyboard] = useState({});

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess(emptyGuess);
    setAnswer(randomAnswer());
    setKeyboard({});
  };

  useEffect(() => {
    const handleWin = () => {
      alert(`You won with ${guesses.length} guesses!`);
      resetGame();
    };
    const handleLose = () => {
      alert(`You lost! The answer was ${answer}`);
      resetGame();
    };
    const latestGuess = guesses[guesses.length - 1];
    if (guesses.length === 6) return handleLose();
    const isWin = latestGuess?.every(({ correctLocation }) => correctLocation);
    if (isWin) handleWin();
  }, [guesses, answer]);

  const handleGuess = () => {
    if (currentGuess.filter(Boolean).length !== 5) return;
    if (!fiveLetterWords.includes(currentGuess.join("").toLowerCase()))
      return alert("Invalid word");
    let updatedKeyboad = { ...keyboard };
    const newGuess = currentGuess.map((letter, i) => {
      const correctLocation = letter === answer[i];
      const incorrectLocation = answer.includes(letter);
      if (correctLocation) {
        updatedKeyboad = { ...updatedKeyboad, [letter]: "correct" };
      } else if (incorrectLocation && updatedKeyboad[letter] !== "correct") {
        updatedKeyboad = { ...updatedKeyboad, [letter]: "incorrect" };
      }
      return { letter, correctLocation, incorrectLocation };
    });
    setKeyboard(updatedKeyboad);
    setGuesses([...guesses, newGuess]);
    setCurrentGuess(emptyGuess);
    emulateTab(-4);
  };

  return (
    <>
      {guesses.map((guess, i) => (
        <div key={i}>
          {guess.map(({ letter, correctLocation, incorrectLocation }, i) => (
            <div
              style={{
                ...letterStyle,
                display: "inline-block",
                textAlign: "center",
                padding: "1px",
                backgroundColor: correctLocation
                  ? "lightgreen"
                  : incorrectLocation
                  ? "yellow"
                  : "grey",
              }}
              children={letter}
            />
          ))}
        </div>
      ))}
      {new Array(5).fill(0).map((_, i) => {
        const setValue = (val) => {
          const newGuess = [...currentGuess];
          newGuess[i] = val;
          setCurrentGuess(newGuess);
        };
        return (
          <input
            style={letterStyle}
            value={currentGuess[i] || ""}
            onChange={({ target: { value } }) => {
              const latestLetter = value[value.length - 1]?.toUpperCase();
              if (latestLetter?.match(/[A-Z]/i)) {
                if (i < 5) setValue(latestLetter);
                if (i < 4) emulateTab();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                if (currentGuess[i] === "" && i !== 0) {
                  const newGuess = [...currentGuess];
                  newGuess[i - 1] = "";
                  setCurrentGuess(newGuess);
                  return emulateTab.backwards();
                } else return setValue("");
              }
              if (e.key === "Enter") return handleGuess();
            }}
          />
        );
      })}
      <div style={{ maxWidth: 300, textAlign: "center" }}>
        {new Array(26).fill(0).map((_, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              disabled
              key={i}
              style={{
                backgroundColor:
                  keyboard[letter] === "correct"
                    ? "lightgreen"
                    : keyboard[letter] === "incorrect"
                    ? "yellow"
                    : "grey",
              }}
              children={letter}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
