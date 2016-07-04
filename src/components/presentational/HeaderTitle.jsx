import React from 'react';
import { TempInputBox } from './TempInputBox.jsx';

export class HeaderTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
  }

  getContents() {
    if (!this.state.editing) {
      return (
        <h2 onDoubleClick={this.startEditing} className="category-title">
          {this.props.titleText}
        </h2>
      );
    }
    return (
      <TempInputBox
        childClass="category-title"
        value={this.props.titleText}
        onBlur={this.stopEditing}
        onChange={this.props.onUpdateTitle}
      />
    );
  }

  startEditing() {
    this.setState({
      editing: true,
    });
  }

  stopEditing() {
    this.setState({
      editing: false,
    });
  }

  render() {
    return this.getContents();
  }
}

HeaderTitle.propTypes = {
  titleText: React.PropTypes.string,
  onUpdateTitle: React.PropTypes.func,
};
