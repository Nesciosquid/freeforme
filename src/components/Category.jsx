const React = require('react');
const CardList = require('./CardList.jsx');
const Constants = require('./Constants.js');
const DropTarget = require('react-dnd').DropTarget;

import { getResponseCount } from '../storeFunctions.js';

const categoryTarget = {
  drop: function drop(props, monitor) {
    monitor.getItem().onItemDrop(props.category);
  },
  canDrop: function canDrop(props, monitor) {
    return monitor.getItem().header === props.header;
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    isDragging: monitor.getItem(),
  };
}

const CategoryTitle = ({ titleText, count }) => (
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

const Category = ({ category, locked, header, connectDropTarget,
   isOver, canDrop, isDragging }, { store }) => {
  const count = getResponseCount(store, header, category);
  const getClassText = () => {
    if (locked) return 'subcategory locked';
    return 'subcategory floating';
  };
  const classText = getClassText();

  let style;
  if (canDrop && isOver) {
    style = {
      border: '1px solid green',
    };
  } else if (canDrop) {
    style = {
      border: '1px solid blue',
    };
  } else if (!canDrop && isDragging) {
    style = {
      border: '1px solid red',
    };
  }

  return connectDropTarget(
    <div style={style} className={classText}>
      <CategoryTitle
        titleText={category}
        count={count}
      />
      <CardList header={header} category={category} />
    </div>
  );
};

Category.contextTypes = {
  store: React.PropTypes.object,
};

Category.propTypes = {
  category: React.PropTypes.string,
  locked: React.PropTypes.bool,
  header: React.PropTypes.string,
};

module.exports = new DropTarget(
  Constants.ITEM_TYPES.RESPONSE_CARD, categoryTarget, collect)(Category);
