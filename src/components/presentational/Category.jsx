const React = require('react');
const CardList = require('./CardList.jsx');

import { CategoryTitle } from './CategoryTitle.jsx';

export const Category = ({ name, count, locked,
   hoverStatus, responses, createItemDropHandler }) => {
  let classText = 'subcategory ';
  if (locked) classText += 'locked ';
  else classText += 'floating ';
  switch (hoverStatus) {
    case ('OK'):
      classText += 'card-hover-OK';
      break;
    case ('SELECTED'):
      classText += 'card-hover-selected';
      break;
    case ('BAD'):
      classText += 'card-hover-BAD';
      break;
    default:
      classText += 'card-hover-none';
      break;
  }

  return (
    <div className={classText}>
      <CategoryTitle
        titleText={name}
        count={count}
      />
      <CardList
        cards={responses}
        createItemDropHandler={createItemDropHandler}
      />
    </div>
  );
};

Category.contextTypes = {
  store: React.PropTypes.object,
};

Category.propTypes = {
  name: React.PropTypes.string,
  count: React.PropTypes.bool,
  locked: React.PropTypes.string,
  hoverStatus: React.PropTypes.string,
  responses: React.PropTypes.array,
  createItemDropHandler: React.PropTypes.func,
};
