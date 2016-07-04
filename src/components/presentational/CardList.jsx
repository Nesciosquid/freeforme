import React from 'react';
import DraggableResponseCard from '../DraggableResponseCard.jsx';

const CardList = ({ cards, header, addUniqueToCategory }) => {
  const cardComponents = [];
  cards.forEach((card) => {
    const response = card[0];
    const count = card[1];
    cardComponents.push(
      <DraggableResponseCard
        key={response}
        response={response}
        count={count}
        header={header}
        onItemDrop={addUniqueToCategory}
      />);
  });

  return (
    <div className="card-list">
      {cardComponents}
    </div>
  );
};

CardList.propTypes = {
  header: React.PropTypes.string,
  cards: React.PropTypes.array,
  addUniqueToCategory: React.PropTypes.func,
};

module.exports = CardList;
