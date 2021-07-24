"use strict";

const React = require("react");
const logo = require("./images/gonghao.jpg");
require ("./search.less");

const Search = () => {
  return (
    <div className="search-text">
      search 期待晨光
      <img width="200" src={logo} ></img>
    </div>
  );
};

module.exports = <Search />