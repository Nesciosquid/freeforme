const React = require('react');
const ResponseCard = require('./ResponseCard.jsx');

const CardList = ({ cards, createItemDropHandler }) => {
  const cardComponents = [];
  cards.forEach((card) => {
    const response = card[0];
    const count = card[1];
    cardComponents.push(
      <ResponseCard
        key={response}
        count={count}
        onDrop={createItemDropHandler(response)}
      />);
  });

  return (
    <div className="card-list">
      {cardComponents}
    </div>
  );
};

CardList.propTypes = {
  cards: React.PropTypes.array,
  createItemDropHandler: React.PropTypes.func,
};

module.exports = CardList;
