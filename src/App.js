import './App.css';
import React, { useState, useCallback } from 'react';
import axios from "axios";

function App() {
  const [result, setResult] = useState([]);

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleSearchText = async (event) => {
    const searchText = event.target.value
    const endpoint = `https://www.googleapis.com/books/v1/volumes?q=${searchText}`
    const response = await axios.get(endpoint)
    setResult(response.data.items)
  };


  const optimizedFn = useCallback(debounce(handleSearchText), []);


  return (
    <div className="App">
      <div className="head"><h1>Find a Book</h1></div>
      <div className='all-box'>
        <input
          className="search-input"
          placeholder="search for your stuff here!"
          onChange={optimizedFn} />
        <div><p>Search results:</p></div>
        {result.map((item, index) => {
          return (
            <div className="results" key={index}>
              <div className="list">
                <a className="item-link" href={item.volumeInfo.previewLink}>
                  <h3> {item.volumeInfo.title}</h3>
                </a>
              </div>
            </div>)
        })
        }
      </div>
    </div>
  );
};

export default App;