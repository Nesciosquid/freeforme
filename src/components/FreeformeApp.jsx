var React = require('react');
var HeaderGroup = require('./HeaderGroup.jsx');

var HTML5Backend = require('react-dnd-html5-backend');
var DragDropContext = require('react-dnd').DragDropContext;

var category_suffix = "-categorized";

var FreeformeApp = React.createClass({
  render: function() {
    var headers = [];
    for (let headerKey in this.props.data){
      let header = this.props.data[headerKey];
        if (headerKey.split(category_suffix).length == 1){
                headers.push(
          <HeaderGroup header={header}
          headerName={headerKey} 
          key={headerKey}/>
        );
      }
    };
    return (
      <div>
        {headers}
      </div>
    );
  }
});

module.exports = DragDropContext(HTML5Backend)(FreeformeApp);