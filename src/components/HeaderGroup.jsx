const React = require('react');
const Category = require('./Category.jsx');
const Constants = require('./Constants.js');
const DropTarget = require('react-dnd').DropTarget;

import { HeaderTitle } from './headerTitle.jsx';
import { renameHeader } from '../reducers/actionCreators.js';
import { getResponseCount, getCategories } from '../storeFunctions.js';

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
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    isDragging: monitor.getItem(),
  };
}

const HeaderGroup = ({ header, connectDropTarget, isDragging, canDrop, isOver }, { store }) => {
  const locked = [];
  const floating = [];
  const categories = getCategories(store, header);

  const onUpdateTitle = (event) => {
    store.dispatch(renameHeader(header, event.target.value));
  };

  let className = 'category ';
  if (isDragging) {
    if (canDrop) className += 'card-hover-selected';
  }
  Object.keys(categories).forEach((categoryKey) => {
    const count = getResponseCount(store, header, categoryKey);
    const catLocked = (categoryKey === 'Uncategorized');
    if (catLocked || count > 0) {
      const catComponent = (
        <Category
          header={header}
          locked={catLocked}
          category={categoryKey}
          key={categoryKey}
        />
    );
      if (catLocked) locked.push(catComponent);
      else floating.push(catComponent);
    }
  });

  return connectDropTarget(
    <div className={className}>
      <HeaderTitle titleText={header} onUpdateTitle={onUpdateTitle} />
      <div className="row">
        <div className="three columns uncategorized-list">
          {locked}
        </div>
        <div className="nine columns subcategory-holder">
          {floating}
        </div>
      </div>
    </div>
  );
};

HeaderGroup.contextTypes = {
  store: React.PropTypes.object,
};


HeaderGroup.propTypes = {
  header: React.PropTypes.string,
};

module.exports = new DropTarget(Constants.ITEM_TYPES.RESPONSE_CARD,
     headerTarget, collect)(HeaderGroup);
