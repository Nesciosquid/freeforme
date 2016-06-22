const React = require('react');
const ResponseCard = require('./ResponseCard.jsx');

const CardList = (props) => {
  let cards = [];
  Object.keys(props.responses).forEach((responseKey) => {
    let response = props.responses[responseKey];
    if (response) {
      cards.push(<ResponseCard key={response.id} response={response} />);
    }
  });

  return (
    <div className="card-list">
      {cards}
    </div>
  );
};

CardList.propTypes = {
  responses: React.PropTypes.object,
};

module.exports = CardList;
