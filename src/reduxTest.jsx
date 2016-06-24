const Redux = require('redux');
const React = require('react');
const ReactDOM = require('react-dom');

const reducer = require('./reducers/index.js');
/*
const counter = require('./reducers/counter.js');
const Counter = require('./components/Counter.jsx');

const store = Redux.createStore(counter);

const counterRoot = document.getElementById('reduxRoot');

const inc = function() {
  store.dispatch({ type: 'INCREMENT' });
};

const dec = function() {
  store.dispatch({ type: 'DECREMENT' });
};

function render() {
  ReactDOM.render(
    <Counter value={store.getState()} onIncrement={inc} onDecrement={dec} />,
  counterRoot
  );
}

store.subscribe(render);
render();
*/
