import expect from 'expect';

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'RESET':
      return 0;
    default:
      return state;
  }
};

expect(counter(0, { type: 'INCREMENT' })).toEqual(1);
expect(counter(1, { type: 'DECREMENT' })).toEqual(0);
expect(counter(2, { type: 'DECREMENT' })).toEqual(1);
expect(counter(undefined, { type: 'INCREMENT' })).toEqual(1);
expect(counter(undefined, { type: 'DECREMENT' })).toEqual(-1);

module.exports = counter;
