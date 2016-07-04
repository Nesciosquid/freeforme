const React = require('react');
const Constants = require('./Constants.js');
const DragSource = require('react-dnd').DragSource;

import { ResponseCard } from './presentational/ResponseCard.jsx';

const responseCardSource = {
  beginDrag: ({ response, category }) => (
    {
      response,
      category,
    }
  ),
  endDrag: (props, monitor) => {
    if (monitor.didDrop()) {
      const dropResult = monitor.getDropResult();
      props.onItemDrop(dropResult.targetCategory);
    }
  },
};

const collect = (connect, monitor) => (
  {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
);

const DraggableResponseCard = ({ response, count, connectDragSource }) =>
  connectDragSource(
    <div>
      <ResponseCard response={response} count={count} />
    </div>
  );

DraggableResponseCard.propTypes = {
  response: React.PropTypes.string,
  count: React.PropTypes.number,
  onItemDrop: React.PropTypes.func,
};

module.exports = new DragSource(Constants.ITEM_TYPES.RESPONSE_CARD,
   responseCardSource, collect)(DraggableResponseCard);
