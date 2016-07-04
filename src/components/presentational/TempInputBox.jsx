import React from 'react';

export const TempInputBox = ({ childClass, style, value,
   onChange, onBlur, onEnter }) => (
  <input
    className={childClass}
    autoFocus
    style={style}
    defaultValue={value}
    onChange={onChange}
    onBlur={onBlur}
    onKeyDown={(event) => {
      if (event.which === 13) onEnter(event);
    }}
  />
);

TempInputBox.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  onEnter: React.PropTypes.func,
  style: React.PropTypes.object,
  childClass: React.PropTypes.string,
};
