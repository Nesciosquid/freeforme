import React from 'react';
import Constants from './Constants.js';
import { DropTarget } from 'react-dnd';
import { HeaderGroup } from './presentational/HeaderGroup.jsx';

const headerTarget = {
  drop: (props, monitor) => {
    const item = monitor.getItem();
    return {
      targetCategory: item.response,
    };
  },
  canDrop: function canDrop(props, monitor) {
    if (monitor.isOver({ shallow: true })) {
      return monitor.getItem().header === props.header;
    } return false;
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isDragging: monitor.getItem(),
  };
}

function assignUniquesToCategories(uniques, categories) {
  const newCategories = {};
  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    const responses = [];
    let count = 0;
    if (category) {
      category.forEach(responseType => {
        const responseCount = uniques[responseType];
        count += responseCount;
        responses.push([responseType, responseCount]);
      });
    }
    if (count > 0) newCategories[categoryKey] = responses;
  });
  return newCategories;
}

const DraggableHeaderGroup = ({ header, categories, uniques,
  connectDropTarget, isDragging, canDrop, addUniqueToCategory }) => {
  let hoverStatus = 'none';
  if (isDragging) {
    if (canDrop) {
      hoverStatus = 'SELECTED';
    }
  }
  const onUpdateTitle = () => {
    Error.log('Header renaming not implemented.');
  };

  let newCategories = assignUniquesToCategories(uniques, categories);
  return connectDropTarget(
    <div>
      <HeaderGroup
        name={header}
        hoverStatus={hoverStatus}
        categories={newCategories}
        onUpdateTitle={onUpdateTitle}
        addUniqueToCategory={addUniqueToCategory}
      />
    </div>
  );
};

DraggableHeaderGroup.propTypes = {
  addUniqueToCategory: React.PropTypes.func,
  header: React.PropTypes.string,
  categories: React.PropTypes.object,
  uniques: React.PropTypes.object,
};

module.exports = new DropTarget(Constants.ITEM_TYPES.RESPONSE_CARD,
     headerTarget, collect)(DraggableHeaderGroup);
