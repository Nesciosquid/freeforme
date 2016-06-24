const React = require('react');

const Counter = (props) => {
  console.log(props);
  return (
    <div>
      <span>{props.value}</span>
      <button onClick={props.onIncrement}>+</button>
      <button onClick={props.onDecrement}>-</button>
    </div>
  );
};

Counter.propTypes = {
  value: React.PropTypes.number,
  onIncrement: React.PropTypes.func,
  onDecrement: React.PropTypes.func,
};

module.exports = Counter;
