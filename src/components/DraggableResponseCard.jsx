const React = require('react');
const Constants = require('./Constants.js');
const DragSource = require('react-dnd').DragSource;

import { ResponseCard } from './presentational/ResponseCard.jsx';

const responseCardSource = {
  beginDrag: ({ response, category, header }) => (
    {
      response,
      category,
      header,
    }
  ),
  endDrag: (props, monitor) => {
    if (monitor.didDrop()) {
      const dropResult = monitor.getDropResult();
      props.onItemDrop(props.header, props.response, dropResult.targetCategory);
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

export default SourcedDraggableResponseCard = new DragSource(Constants.ITEM_TYPES.RESPONSE_CARD,
   responseCardSource, collect)(DraggableResponseCard);
