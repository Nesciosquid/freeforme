const React = require('react');
const CardList = require('./CardList.jsx');

import { CategoryTitle } from './CategoryTitle.jsx';

export const Category = ({ name, count, header, renameCategory,
  locked, hoverStatus, responses, addUniqueToCategory }) => {
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
        onUpdateTitle={(event) => {
          renameCategory(header, name, event.target.value);
        }}
        locked={locked}
      />
      <CardList
        cards={responses}
        header={header}
        addUniqueToCategory={addUniqueToCategory}
      />
    </div>
  );
};

Category.propTypes = {
  header: React.PropTypes.string,
  name: React.PropTypes.string,
  count: React.PropTypes.number,
  locked: React.PropTypes.bool,
  hoverStatus: React.PropTypes.string,
  responses: React.PropTypes.array,
  addUniqueToCategory: React.PropTypes.func,
  renameCategory: React.PropTypes.func,
};
