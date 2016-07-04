const React = require('react');

export const ResponseCard = ({ response, count }) => (
  <div className="response-card">
    <span>
      {response}
    </span>
    <span className="count-badge">
      {count}
    </span>
  </div>
);

ResponseCard.propTypes = {
  response: React.PropTypes.string,
  count: React.PropTypes.number,
};
