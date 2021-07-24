"use strict";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import logo from "./images/gonghao.jpg";
import "./search.less";
import { a, b } from "../../common/index";
import largeNumber from "large-number";

const Search = () => {
  const [Text, setText] = useState(null);

  const loadCom = () => {
    import("./text.js").then((Text) => {
      setText(Text.default);
    });
  };

  const addRes = largeNumber("999", "1");
  return (
    <div className="search-text">
      search 期待晨光
      {a()}
      <img width="200" src={logo} onClick={loadCom}></img>
      {Text ? Text : null}
      <div>addRes:{addRes}</div>
    </div>
  );
};

ReactDOM.render(<Search />, document.getElementById("root"));
