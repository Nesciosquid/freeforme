const React = require('react');
const HeaderGroup = require('./HeaderGroup.jsx');

const HTML5Backend = require('react-dnd-html5-backend');
const DragDropContext = require('react-dnd').DragDropContext;

class FreeformeApp extends React.Component {
  render() {
    const { store } = this.context;
    const categories = store.getState().responseCategories;
    let headers = [];
    Object.keys(categories).forEach((headerKey) => {
      headers.push(
        <HeaderGroup header={headerKey} key={headerKey} />
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
