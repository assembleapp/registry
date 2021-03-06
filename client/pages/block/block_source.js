import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import linkState from "linkstate"

import block_runs_query from "graphql/block_runs.gql"
import create_run from "graphql/create_run.gql"
import { connect } from "react-redux"
import { graphql, compose } from "react-apollo"

import reducers from "reducers"
import Action from "components/action"
import BlockUsage from "./block_usage";
import Column from "layout/column"
import EditableField from "components/editable_field"
import Hint from "components/hint"
import Row from "layout/row"
import Section from "components/section"
import Toggle from "components/toggle"
import border from "styles/border"
import updateBlock from "util/update_block"

class BlockSource extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      source: this.props.source,
    }
  }

  render() {
    return(
      <div>
        <FlexibleRow>
          <LeftColumn>
            <Section>
              <h3>Program</h3>

              <EditableField.Text
                hint="What code should this block run?"
                editable={this.props.editable}
                onChange={this.sourceUpdated.bind(this)}
                initialValue={this.state.source}
                >
                <pre>{ this.state.source }</pre>
              </EditableField.Text>
            </Section>
          </LeftColumn>

          <RightColumn>
            <h3>Inputs</h3>

            <Hint>
              What information does your block need in order to run?
              Please enter JSON.
            </Hint>

            <textarea
              onChange={e => this.props.onInputChange(e.target.value)}
              value={this.props.input_json}
            />

            <FormFooter>
              <Action onClick={() => this.props.onInputChange("{}") }>
                Clear input
              </Action>

              <Button
                type="submit"
                disabled={this.props.session == null}
                onClick={() => this.createRun()}
              >Run the block with these inputs</Button>
            </FormFooter>
          </RightColumn>
        </FlexibleRow>
      </div>
    );
  }

  createRun() {
    this.props.create_run({
      variables: {
        block_id: this.props.id,
        data: JSON.parse(this.props.input_json),
      },
      refetchQueries: [{
        query: block_runs_query,
        variables: { block_id: this.props.id },
      }],
    })

    return false
  }

  sourceUpdated(newSource) {
    this.setState({ source: newSource })
    updateBlock({ source: newSource }, this.props.id)
  }
}

const Icon = styled.img`
  height: 3rem;
`

const LeftColumn = styled(Column)`
  margin-right: 0;
  width: 50%;
`

const RightColumn = styled(Column)`
  padding: 1.5rem;
  background-color: #ffffff;
  border: ${border};
  border-left: none;
  width: 50%;
`

const FormFooter = styled.div`
  position: relative;
  overflow: hidden;
`

const FlexibleRow = styled(Row)`
  align-items: flex-start;
`

const Button = styled.button`
  float: right;
`

BlockSource.propTypes = {
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  input_json: reducers.selectors.input_json(ownProps.id)(state),
})

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onInputChange: (input_json) => dispatch({
      type: "CHANGE_INPUT_JSON",
      variables: { id: ownProps.id },
      input_json: input_json,
    })
  }
)

const ConnectedBlockSource = connect(mapStateToProps, mapDispatchToProps)(BlockSource)

export default compose(
  graphql(create_run, { name: "create_run" }),
)(ConnectedBlockSource);
