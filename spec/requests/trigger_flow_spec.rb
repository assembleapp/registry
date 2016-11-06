# frozen_string_literal: true

require "rails_helper"

describe "POST runs#create" do
  it "exposes the posted parameters in './input.json'" do
    flow = create(:flow, body: <<-JS)
      flow = require('./flow.js')
      console.log(flow.input.foo)
    JS

    expect do
      post "/flows/#{flow.name}/runs", params: { foo: "bar" }
    end.to change(Run, :count).by(1)

    expect(response.body).to eq("Run has been queued.")
    expect(Run.last.output).to eq("bar\n")
  end

  it "exposes any set environment variables to the script" do
    flow = create(:flow, body: <<-JS)
      flow = require('./flow.js')
      console.log(flow.env.foo)
    JS
    create(:env_variable, flow: flow, key: "foo", value: "bar")

    expect do
      post "/flows/#{flow.name}/runs"
    end.to change(Run, :count).by(1)

    expect(response.body).to eq("Run has been queued.")
    expect(Run.last.output).to eq("bar\n")
  end

  it "validates the input against the defined schema" do
    flow = create(
      :flow,
      schema: <<-SCHEMA,
      {
        "title": "Input schema",
        "type": "object",
        "properties": {
          "foo": {
            "type": "integer"
          }
        },
        "required": "foo"
      }
      SCHEMA
    )

    post "/flows/#{flow.name}/runs", params: { foo: "bar" }

    expect(response).to be_unprocessable
    # expect run to not be created
  end
end

describe "POST events#create" do
  it "runs subscribed flows with the provided input" do
    message = "this is a sample message"
    trigger = create(:trigger, schema: <<-JS)
      {
        "type": "object",
        "properties": {
          "message": { "type": "string" }
        },
        "required": ["message"]
      }
    JS

    flow = create(:flow, environment: "node", trigger: trigger, body: <<-JS)
      flow = require('./flow.js')
      console.log(flow.input.message)
    JS

    expect do
      post "/triggers/#{trigger.name}/events", params: { message: message }
    end.to change(Run, :count).by(1)

    run = Run.last
    expect(run.flow).to eq(flow)
    expect(run.output).to eq(message + "\n")
  end

  it "only triggers flows that have a matching schema" do
    skip
    # this is important because we should allow flows
    # to have more restrictive schemas than their triggers.
    # For example,
    # perhaps all of a companies' tweets go through a specific trigger,
    # but we only want our flow to run on one of them.
  end

  it "calls the correct version of the script for you" do
    skip
    # NEEDS DESIGN VALIDATION
    # semantic versioning is incredibly useful,
    # but is still an implementation detail
    # that people shouldn't have to worry about.
    # Instead, we can guess when breaking changes are happening
    # by looking for changes in flows' schemas,
    # and reflect that with a major version bump.
    #
    # When flow A triggers flow B,
    # instead of specifying the version of flow B
    # that we waant to run,
    # we can infer the version based on the `created_at`
    # or most recent `udpated_at` of the script,
    # compared to the creation time of the most recent version of script B.
  end
end