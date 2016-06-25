const React = require('react');
const ResponseCard = require('./ResponseCard.jsx');
import { getUniquesInCategory } from '../storeFunctions.js';
import * as ActionCreators from '../reducers/actionCreators.js';

const CardList = ({ category, header }, { store }) => {
  const cards = [];
  const uniques = getUniquesInCategory(store, header, category);
  Object.keys(uniques).forEach((responseKey) => {
    const onItemDrop = (newCategory) => {
      store.dispatch(ActionCreators.addUniqueResponseToCategory(header, responseKey, newCategory));
    };
    const count = uniques[responseKey];
    if (count) {
      cards.push(
        <ResponseCard
          key={responseKey}
          category={category}
          header={header}
          onItemDrop={onItemDrop}
          response={responseKey}
          count={count}
        />);
    }
  });

  return (
    <div className="card-list">
      {cards}
    </div>
  );
};

CardList.contextTypes = {
  store: React.PropTypes.object,
};

CardList.propTypes = {
  category: React.PropTypes.string,
  header: React.PropTypes.string,
};

module.exports = CardList;
