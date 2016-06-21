var React = require('react');
var Constants = require('./Constants.js');
var DragSource = require('react-dnd').DragSource;

var responseCardSource = {
	beginDrag: function(props){
		return {
			response: props.response
		};
	}
};

function collect(connect, monitor){
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}

var ResponseCard = React.createClass({
  render: function() {
  	var connectDragSource = this.props.connectDragSource;
  	var isDragging = this.props.isDragging;
    return connectDragSource(
      <div className="response-card">
        <span>{this.props.response.getName()}</span>
        <span className="count-badge">{this.props.response.getResponseCount()}</span>
      </div>
    );
  }
});

module.exports = DragSource(Constants.ITEM_TYPES.RESPONSE_CARD, responseCardSource, collect)(ResponseCard);