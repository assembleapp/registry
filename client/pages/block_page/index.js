import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { graphql } from "react-apollo"
import BlockPageQuery from "graphql/block_page.gql"

import BlockSource from "./block_source";
import BlockRuns from "./block_runs";
import Subscription from "./subscription"
import Title from "./title"
import Loading from "components/loading"
import Section from "components/section"

import Row from "layout/row"
import Column from "layout/column"

const BlockPage = ({ data }) => (
  data.loading ? <Loading /> : (
    <Wrapper>
      <MainColumn>
        <Title
          id={data.block.id}
          created_at={data.block.created_at}
          description={data.block.description}
          editable={data.block.editable}
          name={data.block.name}
          user={data.block.author}
        />

        <BlockSource
          editable={data.block.editable}
          environment={data.block.environment}
          environments={data.environments}
          id={data.block.id}
          initial_input_data={data.block.initial_input_data}
          name={data.block.name}
          schema={data.block.schema}
          session={data.session}
          source={data.block.source}
          user_api_key={data.session.api_key}
        />

        <Subscription
          {...data.block.subscription}
          block_id={data.block.id}
          schema={data.block.schema}
        />
      </MainColumn>

      <RightSidebar>
        <BlockRuns block_id={data.block.id} />
      </RightSidebar>
    </Wrapper>
  )
)

const Wrapper = styled.div`
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  position: relative;
`

const MainColumn = styled.div`
  margin-right: 1.5rem;
  overflow-x: scroll;
  padding: 1.5rem;
`

const RightSidebar = styled.div`
  flex: 0 0 20rem;
`

const BlockPageWithData = graphql(BlockPageQuery, { options: {
  variables: { block_id: window.location.pathname.split("/")[2] }
}})(BlockPage)

export default BlockPageWithData;