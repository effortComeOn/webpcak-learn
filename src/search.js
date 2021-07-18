"use strict";

import React from "react";
import ReactDOM from "react-dom";
import logo from "./images/gonghao.jpg";
import "./search.less";

const Search = () => {
  return (
    <div className="search-text">
      search123123
      <img width="200" src={logo}></img>
    </div>
  );
};

ReactDOM.render(<Search />, document.getElementById("root"));
