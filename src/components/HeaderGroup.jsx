const React = require('react');
const Category = require('./Category.jsx');

const HeaderTitle = (props) => (
  <h2 className="category-title">{props.titleText}</h2>
);

HeaderTitle.propTypes = {
  titleText: React.PropTypes.string,
};

const HeaderGroup = (props) => {
  let locked = [];
  let floating = [];

  Object.keys(props.header).forEach((categoryKey) => {
    let category = props.header[categoryKey];
    if (category.locked || category.getResponseCount() > 0) {
      const catComponent = <Category category={category} key={category.id} />;
      if (category.locked) locked.push(catComponent);
      else floating.push(catComponent);
    }
  });

  return (
    <div className="category">
      <HeaderTitle titleText={props.headerName} />
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
  header: React.PropTypes.object,
  headerName: React.PropTypes.string,
};

module.exports = HeaderGroup;
