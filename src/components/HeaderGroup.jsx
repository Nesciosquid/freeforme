var React = require('react');
var Category = require("./Category.jsx");

var HeaderTitle = React.createClass({
  render: function() {
    return (
      <h2 className="category-title">{this.props.titleText}</h2>
    );
  }
});

var HeaderGroup = React.createClass({
  render: function() {
    let locked = [];
    let floating = [];

    for (let categoryKey in this.props.header){
      let category = this.props.header[categoryKey];
      if (category.locked || category.getResponseCount() > 0){
        let catComponent = <Category category={category} key={category.id}/>
        category.locked ? locked.push(catComponent) : floating.push(catComponent);
      }
    }

    return (
      <div className="category">
        <HeaderTitle titleText={this.props.headerName}/>
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
  }
}); 

module.exports = HeaderGroup;