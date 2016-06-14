var Foo = React.createClass({
  render: function() {
      return ( 
        <h1>baz</h1>
      );
    }
  }
);

var FreeformeApp = React.createClass({
  render: function() {
    return (
      <div>
        <HeaderGroup headerName="firstHeader"/>
      </div>
    );
  }
});

var HeaderTitle = React.createClass({
  render: function() {
    return (
      <h2 className="category-title">{this.props.titleText}</h2>
    );
  }
});

var HeaderGroup = React.createClass({
  render: function() {
    return (
      <div className="category">
        <HeaderTitle titleText={this.props.headerName}/>
        <div className="row">
          <div className="three columns uncategorized-list">
            <Category categoryName="uncategorized" locked={true}/>
          </div>
          <div className="nine columns subcategory-holder">
            <Category categoryName="somethingElse" locked={false}/>
          </div>
        </div>
      </div>
    );
  }
}); 

var CardList = React.createClass({
  render: function() {
    return (
      <div className="card-list"/>
    );
  }
})

var Category = React.createClass({
  getInitialState: function() {
    return ({
      count: 0,
      responses: []
    });
  },
  render: function() {
    let classText;
    if (this.props.locked){
      classText = "subcategory locked-category";
    } else {
      classText = "subcategory floating";
    }
    return(
      <div className={classText}>
        <CategoryTitle titleText={this.props.categoryName} count={this.state.count} />
        <CardList />
      </div>
    );
  }
});

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

ReactDOM.render(
  <FreeformeApp/>,
  document.getElementById('reactContainer')
);