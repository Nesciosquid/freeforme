const React = require('react');
const DraggableHeaderGroup = require('./DraggableHeaderGroup.jsx');

const HTML5Backend = require('react-dnd-html5-backend');
const DragDropContext = require('react-dnd').DragDropContext;

class FreeformeApp extends React.Component {
  render() {
    const { store } = this.context;
    const categories = store.getState().responseCategories;
    const uniques = store.getState().uniqueResponses;
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

FreeformeApp.contextTypes = {
  store: React.PropTypes.object,
};

FreeformeApp.propTypes = {
  data: React.PropTypes.object,
};

module.exports = new DragDropContext(HTML5Backend)(FreeformeApp);
