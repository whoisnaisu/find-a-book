import './App.css';
import React, { useState, useCallback } from 'react';
import axios from "axios";
import glass from "../src/assets/loupe-svgrepo-com.svg"

function App() {
  const [result, setResult] = useState([]);
  const [isError, setIsError] = useState(false)

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
    try {
      const searchText = event.target.value || null;
      const cancelToken = axios.CancelToken.source();

      if (searchText === null) {
        setResult([])
      } else {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}`, { cancelToken: cancelToken.token })
        setResult(response.data.items)
      }
      return () => {
        cancelToken.cancel();
      }
    } catch (error) {
      setIsError(!isError)
      const reload = () => window.location.reload()
      setTimeout(() => { reload() }, 1000)
    }
  };

  const optimizedFn = useCallback(debounce(handleSearchText), []);

  return (
    <div className="App">
      <div className="picture" onClick={() => { alert("Search a book you would like to know!") }} ><img className="magnifying-glass" src={glass} alt="magnifying glass" /></div>
      <div className="head">
        <h1 className="f">F</h1>
        <h1 className="i">i</h1>
        <h1 className="n">n</h1>
        <h1 className="d">d</h1>
        <h1 className="a">&nbsp;a&nbsp;</h1>
        <h1 className="b">B</h1>
        <h1 className="o1">o</h1>
        <h1 className="o2">o</h1>
        <h1 className="k">k</h1>
      </div>
      <div className='all-box'>
        <input
          className="search-input"
          placeholder="search here!"
          onChange={optimizedFn} />
        <div><p>Search results will show here:</p></div>
        <div className="results" >
          {!isError ? (result.map((item) => {
            return (
              <div className="item-list" key={item.id}>
                <a className="item-link" href={item.volumeInfo.previewLink}>
                  {item.volumeInfo.title} by {item.volumeInfo.authors || "no author info available"} <p>(Published on: {item.volumeInfo.publishedDate || "no published info available"})</p>
                </a>
              </div>)
          })
          ) : <div><p>reloading...</p></div>}
        </div>
      </div>

    </div>
  );
};

export default App;