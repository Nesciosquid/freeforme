const React = require('react');
const Category = require('./Category.jsx');
import { getResponseCount, getCategories } from '../storeFunctions.js';

const HeaderTitle = (props) => (
  <h2 className="category-title">{props.titleText}</h2>
);

HeaderTitle.propTypes = {
  titleText: React.PropTypes.string,
};

const HeaderGroup = ({ header }, { store }) => {
  const locked = [];
  const floating = [];
  const categories = getCategories(store, header);

  Object.keys(categories).forEach((categoryKey) => {
    const count = getResponseCount(store, header, categoryKey);
    const catLocked = (categoryKey === 'Uncategorized');
    if (catLocked || count > 0) {
      const catComponent = (
        <Category
          header={header}
          locked={catLocked}
          category={categoryKey}
          key={categoryKey}
        />
    );
      if (catLocked) locked.push(catComponent);
      else floating.push(catComponent);
    }
  });

  return (
    <div className="category">
      <HeaderTitle titleText={header} />
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

HeaderGroup.contextTypes = {
  store: React.PropTypes.object,
};


HeaderGroup.propTypes = {
  header: React.PropTypes.string,
};

module.exports = HeaderGroup;
