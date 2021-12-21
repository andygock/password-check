import React from "react";
import axios from "axios";

import "./style.scss";

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
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const fetchPwned = async (hash) => {
  // console.log(`fetchPwned('${hash}')`);

  const url = `https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`;
  const response = await axios({
    method: "get",
    url,
  });

  if (response.status !== 200) {
    throw new Error("API server not responded unexpectedly");
  }

  const hashesFound = response.data
    .split("\n")
    .filter((s) => s.includes(hash.toUpperCase().slice(-5)))
    .map((s) => s.split(":"));

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

  const search = async (text) => {
    setIsSearching(true);
    const hashHex = await digest(text);
    setCount(await fetchPwned(hashHex));
    setIsSearching(false);
  };

  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <header>
          <h1>Password Check</h1>
          <p>
            Check a password against known data breaches using the{" "}
            <a href="https://haveibeenpwned.com/API/v3#PwnedPasswords">
              Have I Been Pwned API
            </a>
            .
          </p>
        </header>

        <main>
          <form className="pure-form">
            <fieldset>
              <label htmlFor="password">Enter password to check:</label>
              <input
                id="password"
                ref={inputRef}
                type="password"
                value={password}
                placeholder="Enter password..."
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    search(password);
                    e.target.select();
                  }
                }}
              />
              <button
                className="pure-button pure-button-primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  search(password);
                  inputRef.current.select();
                }}
                disabled={isSearching}
              >
                Search
              </button>
            </fieldset>
          </form>
          <p style={{ color: count > 0 ? "red" : "black" }}>
            This password has been seen <strong>{count}</strong> time
            {count !== 1 ? "s" : ""} before.
          </p>
          {count > 0 && (
            <p style={{ color: "red" }}>
              This password has previously appeared in a data breach and should
              never be used. If you've ever used it before anywhere, change it
              immediately!
            </p>
          )}
          <p>
            Password complexity is <strong>not</strong> checked.
          </p>
          <p>
            This page will not send your password away from the web browser. The
            password's SHA-1 hash is calculated in-browser, and the first 5
            characters of the 40 character hexadecimal hash is sent to{" "}
            <a href="https://haveibeenpwned.com/API/v3#PwnedPasswords">
              https://haveibeenpwned.com/API/v3
            </a>
          </p>
        </main>
        <footer>
          &copy; <a href="https://gock.net">Andy Gock</a> |{" "}
          <a href="https://github.com/andygock/password-check/">
            Source code on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
