import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import linkState from "linkstate"

import Hint from "components/hint"

class EditableString extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editedValue: null,
    }
  }

  render() {
    return (
      <span>
        {this.state.editedValue == null
          ? <span
            onClick={this.startEditing.bind(this)}
            role="link">
            {this.props.children}
            </span>
          : <div>
              <Hint>{this.props.hint}</Hint>
              <input
                type='text'
                value={this.state.editedValue}
                onChange={linkState(this, "editedValue")}
                onBlur={this.finishEditing.bind(this)}
                ref={(input) => { if(input) { input.focus() }}}
                onKeyDown={this.editingKeyDown.bind(this)}
                style={{ marginRight: "0.5rem" }}
                />
            </div>
        }
      </span>
    );
  }

  startEditing() {
    if(this.props.editable)
      this.setState({ editedValue: this.props.initialValue })
  }

  edit() {
    this.setState({ editing: !this.state.editing });
  }

  editingKeyDown(e) {
    // If the user just hit enter
    if (e.keyCode == 13) {
      e.stopPropagation();
      this.finishEditing();
    }
  }

  finishEditing() {
    var newValue = this.state.editedValue;
    this.setState({ editedValue: null });
    this.props.onChange(newValue);
  }
}

EditableString.propTypes = {
  onChange: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  initialValue: PropTypes.string.isRequired,
}

const Link = styled.span`
  color: blue;
`

export default EditableString;
