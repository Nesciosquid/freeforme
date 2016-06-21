var React = require('react');
var ReactDOM = require('react-dom');
var Board = require('./Board.jsx');
var observe = require('./Game.js').observe;

var rootEl = document.getElementById('reactContainer');

observe(function (knightPosition) {
  ReactDOM.render(
    <Board knightPosition={knightPosition} />,
    rootEl
  );
});