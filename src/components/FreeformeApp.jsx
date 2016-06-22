const React = require('react');
const HeaderGroup = require('./HeaderGroup.jsx');

const HTML5Backend = require('react-dnd-html5-backend');
const DragDropContext = require('react-dnd').DragDropContext;

const categorySuffix = '-categorized';

class FreeformeApp extends React.Component {
  render() {
    let headers = [];
    Object.keys(this.props.data).forEach((headerKey) => {
      let header = this.props.data[headerKey];
      if (headerKey.split(categorySuffix).length === 1) {
        headers.push(
          <HeaderGroup header={header} headerName={headerKey} key={headerKey} />
        );
      }
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
};

module.exports = new DragDropContext(HTML5Backend)(FreeformeApp);
