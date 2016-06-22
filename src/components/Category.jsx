const React = require('react');
const CardList = require('./CardList.jsx');
const Constants = require('./Constants.js');
const DropTarget = require('react-dnd').DropTarget;

const categoryTarget = {
  drop: function drop(props, monitor) {
    props.category.setChildResponseType(monitor.getItem().response);
    //  TODO: Replace this with an updatestate command?
    window.updateReact();
  },
  canDrop: function canDrop(props, monitor) {
    return monitor.getItem().response.header === props.category.header;
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

const CategoryTitle = (props) => (
  <div className="category-title-div">
    <h5 className="category-title">
      <span className="category-title-span">
        {props.titleText}
      </span>
      <span className="count-badge">
        {props.count}
      </span>
    </h5>
  </div>
);

CategoryTitle.propTypes = {
  count: React.PropTypes.number,
  titleText: React.PropTypes.string,
};

const Category = (props) => {
  const getClassText = () => {
    const locked = props.category.locked;
    if (locked) return 'subcategory locked';
    return 'subcategory floating';
  };
  const connectDropTarget = props.connectDropTarget;
  const isOver = props.isOver;
  const canDrop = props.canDrop;
  const classText = getClassText();
  const category = props.category;
  const isDragging = props.isDragging;

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
        titleText={category.name}
        count={category.getResponseCount()}
      />
      <CardList responses={category.getResponseTypes()} />
    </div>
  );
};

module.exports = new DropTarget(
  Constants.ITEM_TYPES.RESPONSE_CARD, categoryTarget, collect)(Category);
