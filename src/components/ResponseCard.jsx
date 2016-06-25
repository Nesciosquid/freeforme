const React = require('react');
const Constants = require('./Constants.js');
const DragSource = require('react-dnd').DragSource;

const responseCardSource = {
  beginDrag: ({ header, response, category, onItemDrop }) => (
    {
      response,
      header,
      category,
      onItemDrop,
    }
  ),
};

const collect = (connect, monitor) => (
  {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
);

const ResponseCard = ({ response, count, connectDragSource }) => connectDragSource(
  <div className="response-card">
    <span>
      {response}
    </span>
    <span className="count-badge">
      {count}
    </span>
  </div>
);

ResponseCard.propTypes = {
  response: React.PropTypes.string,
  count: React.PropTypes.number,
  onItemDrop: React.PropTypes.func,
};

module.exports = new DragSource(Constants.ITEM_TYPES.RESPONSE_CARD,
   responseCardSource, collect)(ResponseCard);
