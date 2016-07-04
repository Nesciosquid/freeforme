import React from 'react';
import DraggableResponseCard from '../DraggableResponseCard.jsx';

const CardList = ({ cards }) => {
  const cardComponents = [];
  cards.forEach((card) => {
    const response = card[0];
    const count = card[1];
    cardComponents.push(
      <DraggableResponseCard
        key={response}
        response={response}
        count={count}
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
