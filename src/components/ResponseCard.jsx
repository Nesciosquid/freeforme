const React = require('react');
const Constants = require('./Constants.js');
const DragSource = require('react-dnd').DragSource;

const responseCardSource = {
  beginDrag: (props) => (
    {
      response: props.response,
    }
  ),
};

const collect = (connect, monitor) => (
  {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
);

const ResponseCard = (props) => {
  const connectDragSource = props.connectDragSource;
  return connectDragSource(
    <div className="response-card">
      <span>
        {props.response.getName()}
      </span>
      <span className="count-badge">
        {props.response.getResponseCount()}
      </span>
    </div>
  );
};

module.exports = new DragSource(Constants.ITEM_TYPES.RESPONSE_CARD,
   responseCardSource, collect)(ResponseCard);
