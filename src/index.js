import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "./styles.css";

// https://haveibeenpwned.com/API/v3#PwnedPasswords

// generate SHA-1 hash of a string, return as a hexadecimal string
const digest = async (input, type = "SHA-1") => {
  // based on: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(type, data);

  // convert buffer to byte array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
};

const fetchPwned = async hash => {
  const url = `https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`;
  const response = await axios.get(url);

  if (response.status !== 200) {
    throw new Error("API server not responded unexpectedly");
  }

  const hashesFound = response.data
    .split("\n")
    .filter(s => s.includes(hash.toUpperCase().slice(-5)))
    .map(s => s.split(":"));

  if (hashesFound.length) {
    const count = hashesFound[0][1];
    return count;
  } else {
    return 0;
  }
};

const App = () => {
  const [password, setPassword] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);

  const inputRef = React.useRef();

  const search = async text => {
    setIsSearching(true);
    const hashHex = await digest(text);
    setCount(await fetchPwned(hashHex));
    setIsSearching(false);
  };

  return (
    <div className="App">
      <h1>Password Check</h1>
      <p>
        Check a password against known data breaches using{" "}
        <a href="https://haveibeenpwned.com/API/v3#PwnedPasswords">
          Have I Been Pwned API
        </a>
        .
      </p>
      <input
        ref={inputRef}
        type="password"
        value={password}
        placeholder="Enter password..."
        onChange={e => setPassword(e.target.value)}
        onKeyUp={e => {
          if (e.key === "Enter") {
            search(password);
            e.target.select();
          }
        }}
      />
      <button
        type="submit"
        onClick={e => {
          search(password);
          inputRef.current.select();
        }}
        disabled={isSearching}
      >
        Search
      </button>
      <p style={{ color: count > 0 ? "red" : "black" }}>
        This password has been seen {count} time{count !== 1 ? "s" : ""} before.
      </p>
      {count > 0 && (
        <p style={{ color: "red" }}>
          This password has previously appeared in a data breach and should
          never be used. If you've ever used it before anywhere, change
          it immediately!
        </p>
      )}
      <p>
        Password complexity is <strong>not</strong> checked.
      </p>
      <footer>
        &copy; <a href="https://gock.net/">Andy Gock</a> |{" "}
        <a href="https://github.com/andygock/password-check/">
          Source code on GitHub
        </a>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
