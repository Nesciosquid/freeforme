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
      let catComponent = <Category category={category} key={category.id}/>
      category.locked ? locked.push(catComponent) : floating.push(catComponent);
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

var ResponseCard = React.createClass({
  render: function() {
    return (
      <div className="response-card">
        <span>{this.props.response.getName()}</span>
        <span className="count-badge">{this.props.response.getResponseCount()}</span>
      </div>
    );
  }
});

var CardList = React.createClass({
  render: function() {
    let cards = [];
    for (let responseKey in this.props.responses){
      let response = this.props.responses[responseKey];
      cards.push(<ResponseCard key={response.id} response={response}/>);
    }
    return (
      <div className="card-list">
        {cards}
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
    let classText = this.getClassText();
    let category = this.props.category;
    return(
      <div className={classText}>
        <CategoryTitle titleText={category.name} count={this.countCategories()} />
        <CardList responses={category.getResponseTypes()}/>
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

window.FreeformeApp = FreeformeApp;