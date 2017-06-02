import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import Column from "layout/column"
import EditableField from "components/editable_field"
import Hint from "components/hint"
import Row from "layout/row"
import updateBlock from "util/update_block"

class EventSetup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      repo: this.props.settings.repo,
      branch: this.props.settings.branch,
    }
  }

  render() {
    const information = {
      ref: "string",
      head: "string",
      before: "string",
      size: 123,
      distinct_size: 123,
      commits: [{
        sha: "string",
        message: "string",
        author: {
          name: "string",
          email: "string",
        },
        url: "string",
        distinct: true,
      }]
    }

    return(
      <div>
        <h3>{this.props.service}: {this.props.event}</h3>

        <Settings>
          <h4>Settings</h4>

          <Row>
            <Column>Repository:</Column>
            <Column>
              <EditableField.String
                onChange={this.repoUpdated.bind(this)}
                editable={this.props.editable}
                initialValue={this.state.repo}
              >
                {this.state.repo}
              </EditableField.String>
            </Column>
          </Row>

          <Row>
            <Column>Branch:</Column>
            <Column>
              <EditableField.String
                onChange={this.branchUpdated.bind(this)}
                editable={this.props.editable}
                initialValue={this.state.branch}
              >
                {this.state.branch}
              </EditableField.String>
            </Column>
          </Row>
        </Settings>

        <Information>
          <h4>Event Information</h4>

          <Hint>
            Each time this event fires,
            it will provide this information to your block.
          </Hint>

          <pre>
          { JSON.stringify(information, null, 2) }
          </pre>
        </Information>
      </div>
    );
  }

  branchUpdated(newBranch) {
    this.setState({ branch: newBranch })

    updateBlock(
      { branch: newBranch },
      this.props.user.handle,
      this.props.name,
    )
  }

  repoUpdated(newRepo) {
    this.setState({ repo: newRepo })

    updateBlock(
      { repo: newRepo },
      this.props.user.handle,
      this.props.name,
    )
  }
}

const Settings = styled.div`
  margin-bottom: 1.5rem;
`

const Information = styled.div`
`

EventSetup.propTypes = {
  editable: PropTypes.bool.isRequired,
  event: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  service: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default EventSetup;
