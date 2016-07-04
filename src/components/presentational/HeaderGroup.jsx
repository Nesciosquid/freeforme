const React = require('react');
const DraggableCategory = require('../DraggableCategory.jsx');

import { HeaderTitle } from './HeaderTitle.jsx';

function countResponses(responses) {
  let sum = 0;
  responses.forEach(response => {
    sum += response[1];
  });
  return sum;
}

export const HeaderGroup = ({ name, hoverStatus, categories,
   onUpdateTitle, addUniqueToCategory, renameCategory }) => {
  const locked = [];
  const floating = [];
  let className = 'category ';

  switch (hoverStatus) {
    case ('SELECTED'):
      className += 'card-hover-selected';
      break;
    default:
      break;
  }

  Object.keys(categories).forEach((categoryKey) => {
    const categoryResponses = categories[categoryKey];
    const count = countResponses(categoryResponses);
    const catLocked = (categoryKey === 'Uncategorized');
    if (catLocked || count > 0) {
      const catComponent = (
        <DraggableCategory
          header={name}
          locked={catLocked}
          category={categoryKey}
          count={count}
          responses={categoryResponses}
          key={categoryKey}
          addUniqueToCategory={addUniqueToCategory}
          renameCategory={renameCategory}
        />
    );
      if (catLocked) locked.push(catComponent);
      else floating.push(catComponent);
    }
  });

  return (
    <div className={className}>
      <HeaderTitle titleText={name} onUpdateTitle={onUpdateTitle} />
      <div className="row">
        <div className="three columns uncategorized-list">
          {locked}
        </div>
        <div className="nine columns subcategory-holder">
          {floating}
        </div>
      </div>
    </div>
  );
};

HeaderGroup.propTypes = {
  name: React.PropTypes.string,
  onUpdateTitle: React.PropTypes.func,
  hoverStatus: React.PropTypes.string,
  categories: React.PropTypes.object,
  addUniqueToCategory: React.PropTypes.func,
  renameCategory: React.PropTypes.func,
};
