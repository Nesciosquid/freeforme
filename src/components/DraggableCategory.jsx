const React = require('react');
const Constants = require('./Constants.js');
const DropTarget = require('react-dnd').DropTarget;

import { Category } from './presentational/Category.jsx';

const categoryTarget = {
  drop: function drop(props) {
    return {
      targetCategory: props.category,
    };
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

function computeHoverStatus(isDragging, isOver, canDrop) {
  let hoverState = 'none';
  if (isDragging) {
    if (!canDrop) hoverState = 'BAD';
    else if (isOver) hoverState = 'SELECTED';
    else hoverState = 'OK';
  }
  return hoverState;
}

const DraggableCategory = ({ category, header, locked, connectDropTarget,
   isOver, canDrop, isDragging, responses, count, addUniqueToCategory,
    renameCategory }) => {
  let hoverStatus = computeHoverStatus(isDragging, isOver, canDrop);
  return connectDropTarget(
    <div>
      <Category
        header={header}
        name={category}
        count={count}
        hoverStatus={hoverStatus}
        locked={locked}
        responses={responses}
        addUniqueToCategory={addUniqueToCategory}
        renameCategory={renameCategory}
      />
    </div>
  );
};

DraggableCategory.propTypes = {
  category: React.PropTypes.string,
  locked: React.PropTypes.bool,
  header: React.PropTypes.string,
  addUniqueToCategory: React.PropTypes.func,
  renameCategory: React.PropTypes.func,
};

module.exports = new DropTarget(
  Constants.ITEM_TYPES.RESPONSE_CARD, categoryTarget, collect)(DraggableCategory);
