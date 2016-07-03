import React from 'react';

export const TempInputBox = ({ childClass, style, value, onChange, onBlur }) => (
  <div className={childClass}>
    <input
      autoFocus
      style={style}
      defaultValue={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  </div>
);

TempInputBox.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  style: React.PropTypes.object,
  childClass: React.PropTypes.string,
};
