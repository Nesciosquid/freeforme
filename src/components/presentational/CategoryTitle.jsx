import React from 'react';
import { TempInputBox } from './TempInputBox.jsx';

export class CategoryTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
    this.startEditing = this.startEditing.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
  }

  getContents() {
    if (!this.state.editing) {
      return (
        <div>
          {/* TODO: Fix renaming categories <span onDoubleClick={this.startEditing} className="category-title-span"> */}
          <span className="category-title-span">
            {this.props.titleText}
          </span>
          <span className="count-badge">
            {this.props.count}
          </span>
        </div>
      );
    }
    return (
      <TempInputBox
        childClass="category-title-input-box"
        value={this.props.titleText}
        onBlur={this.stopEditing}
        onEnter={this.stopEditing}
      />
    );
  }

  startEditing() {
    if (!this.props.locked) {
      this.setState({
        editing: true,
      });
    }
  }

  stopEditing(event) {
    this.props.onUpdateTitle(event);
    this.setState({
      editing: false,
    });
  }

  render() {
    return (
      <div className="category-title-div">
        <h5 className="category-title">
          {this.getContents()}
        </h5>
      </div>
    );
  }
}

CategoryTitle.propTypes = {
  count: React.PropTypes.number,
  titleText: React.PropTypes.string,
  onUpdateTitle: React.PropTypes.func,
  locked: React.PropTypes.bool,
};
