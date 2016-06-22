var React = require('react');
var CardList = require("./CardList.jsx");

var Constants = require("./Constants.js");

var DropTarget = require('react-dnd').DropTarget;

var categoryTarget = {
	drop: function(props, monitor){
		props.category.setChildResponseType(monitor.getItem().response);
		//TODO: Replace this with an updatestate command?
		window.updateReact();
	},
	canDrop: function(props, monitor){
		return monitor.getItem().response.header == props.category.header;
	}
};

function collect(connect, monitor){
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
		isDragging: monitor.getItem()
	};
};

var CategoryTitle = React.createClass({
  render: function() {
    return (
        <div className="category-title-div">
          <h5 className="category-title">
            <span className="category-title-span">{this.props.titleText}</span>
            <span className="count-badge">{this.props.count}</span>
          </h5>
        </div>
    );
  }
});

var Category = React.createClass({
  countCategories: function() {
    return this.props.category.getResponseCount();
  },

  getClassText: function() {
    let locked = this.props.category.locked;
    if(locked) return "subcategory locked";
    else return "subcategory floating";
  },

  render: function() {
  	let connectDropTarget = this.props.connectDropTarget;
  	let isOver = this.props.isOver;
  	let canDrop = this.props.canDrop;
    let classText = this.getClassText();
    let category = this.props.category;
    let isDragging = this.props.isDragging;

    let style;
    if (canDrop && isOver){
    	style = {
    		border: "1px solid green"
    	}
    } else if (canDrop){
    	style ={
    		border: "1px solid blue"
    	}
    } else if (!canDrop && isDragging){
    	style = {
    		border: "1px solid red"
    	}
    }

    return connectDropTarget(
      <div style={style} className={classText}>
        <CategoryTitle titleText={category.name} count={this.countCategories()} />
        <CardList responses={category.getResponseTypes()}/>
      </div>
    );
  }
});

module.exports = DropTarget(Constants.ITEM_TYPES.RESPONSE_CARD, categoryTarget, collect)(Category);