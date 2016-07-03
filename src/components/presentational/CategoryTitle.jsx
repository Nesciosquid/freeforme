import React from 'react';

export const CategoryTitle = ({ titleText, count }) => (
  <div className="category-title-div">
    <h5 className="category-title">
      <span className="category-title-span">
        {titleText}
      </span>
      <span className="count-badge">
        {count}
      </span>
    </h5>
  </div>
);

CategoryTitle.propTypes = {
  count: React.PropTypes.number,
  titleText: React.PropTypes.string,
};
