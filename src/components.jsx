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
    let demoCategories = [
      {
        name: "locked",
        locked: true,
        count: 15,
        responses: [
          {
            name: "first",
            count: 10
          },
          {
            name: "second",
            count: 5
          }
        ]
      },
      {
        name: "floating",
        locked: false,
        count: 4,
        responses: [
          {
            name: "float first",
            count: 4
          }
        ]
      }
    ]

    return (
      <div>
        <HeaderGroup categories={demoCategories} headerName="firstHeader"/>
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
  getDefaultProps: function() {
    return {
    categories: []
    }
  },

  render: function() {
    let locked = [];
    let floating = [];

    this.props.categories.forEach(function createResponseCategory(category){
    if (category.locked) {
      locked.push(
          <Category categoryName={category.name}
          key = {category.name}
          locked={true} 
          responses={category.responses}
          count={category.count}/>
      );
    } 
    else {
      floating.push(
          <Category categoryName={category.name}
          key = {category.name}
          locked={false}
          responses={category.responses}
          count={category.count}/>
      );
    } 

    });

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
        <span>{this.props.responseName}</span>
        <span className="count-badge">{this.props.responseCount}</span>
      </div>
    );
  }
});

var CardList = React.createClass({
  render: function() {
    let cards = [];
    this.props.cards.forEach(function createResponseCard(card){
      cards.push(<ResponseCard key={card.name} responseName={card.name} responseCount={card.count}/>);
    });
    return (
      <div className="card-list">
        {cards}
      </div>
    );
  }
});

var Category = React.createClass({
  getDefaultProps: function() {
    return ({
      categoryName: "unnamed category",
      locked: false,
      responses: []
    });
  },

  countCategories: function() {
    return this.props.responses.map(function(response){
      return response.count;
    }).reduce(function(last, current){
      return last + current;
    });
  },

  render: function() {
    let classText;
    this.props.locked ? classText = "subcategory locked" : classText = "subcategory floating";
    return(
      <div className={classText}>
        <CategoryTitle titleText={this.props.categoryName} count={this.countCategories()} />
        <CardList cards={this.props.responses}/>
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