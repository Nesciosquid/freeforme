var React = require('react');
var ResponseCard = require('./ResponseCard.jsx');

var CardList = React.createClass({
  render: function() {
    let cards = [];
    for (let responseKey in this.props.responses){
      let response = this.props.responses[responseKey];
      if (response){
        cards.push(<ResponseCard key={response.id} response={response}/>);
      }
    }
    return (
      <div className="card-list">
        {cards}
      </div>
    );
  }
});

module.exports = CardList;