"use strict";

import React from "react";
import ReactDOM from "react-dom";
import logo from "./images/gonghao.jpg";
import "./search.less";
import { a, b } from "../../common/index";

const Search = () => {
  return (
    <div className="search-text">
      search123123
      {a()}
      <img width="200" src={logo}></img>
    </div>
  );
};

ReactDOM.render(<Search />, document.getElementById("root"));
