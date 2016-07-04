const React = require('react');
const DraggableHeaderGroup = require('./DraggableHeaderGroup.jsx');

const HTML5Backend = require('react-dnd-html5-backend');
const DragDropContext = require('react-dnd').DragDropContext;
import { addUniqueResponseToCategory } from '../reducers/actionCreators.js';

class FreeformeApp extends React.Component {
  render() {
    const store = this.props.store;
    const categories = store.getState().responseCategories;
    const uniques = store.getState().uniqueResponses;
    const addUniqueToCategory = (header, unique, category) => {
      store.dispatch(addUniqueResponseToCategory(header, unique, category));
    };
    let headers = [];
    Object.keys(categories).forEach((headerKey) => {
      const headerCategories = categories[headerKey];
      const headerUniques = uniques[headerKey];
      headers.push(
        <DraggableHeaderGroup
          header={headerKey}
          key={headerKey}
          categories={headerCategories}
          uniques={headerUniques}
          addUniqueToCategory={addUniqueToCategory}
        />
      );
    });
    return (
      <div>
        {headers}
      </div>
    );
  }
}

FreeformeApp.propTypes = {
  data: React.PropTypes.object,
  store: React.PropTypes.object,
};

module.exports = new DragDropContext(HTML5Backend)(FreeformeApp);
