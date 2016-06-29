const React = require('react');
const Constants = require('./Constants.js');
const DragSource = require('react-dnd').DragSource;

const responseCardSource = {
  beginDrag: ({ header, response, category }) => (
    {
      response,
      header,
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

const ResponseCard = ({ response, count, connectDragSource }) => {
  let className = 'response-card';

  return connectDragSource(
    <div onClick={() => this.setState({ dragging: true })} className={className}>
      <span>
        {response}
      </span>
      <span className="count-badge">
        {count}
      </span>
    </div>
  );
};

ResponseCard.propTypes = {
  response: React.PropTypes.string,
  count: React.PropTypes.number,
  onItemDrop: React.PropTypes.func,
};

module.exports = new DragSource(Constants.ITEM_TYPES.RESPONSE_CARD,
   responseCardSource, collect)(ResponseCard);
