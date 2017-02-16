# Remove any data currently in the database

EnvVariable.destroy_all
BlockRun.destroy_all
Block.destroy_all
Event.destroy_all
Feed.destroy_all
User.destroy_all

user = User.create!(handle: "user", password: "password", email: "user@example.com")

Block.create!(
  name: "debug",
  description: "Simply prints out the input that was passed to the flow.",
  github_repo: "graysonwright/debug.block",
  user: user,
)

darksky_schema = {
  type: :object,
  properties: {
    darksky_key: { type: :string },
    latitude: { type: :string },
    longitude: { type: :string }
  },
  required: [:darksky_key, :latitude, :longitude],
}
Block.create!(
  name: "forecast",
  description: "This block connects to the Dark Sky API (https://darksky.net/) to pull the latest weather forecast information.",
  github_repo: "graysonwright/darksky_forecas.block",
  schema: darksky_schema,
  user: user,
)

pushover_schema = {
  type: :object,
  properties: {
    text: { type: :string },
    pushover: {
      type: :object,
      properties: {
        user_id: { type: :string },
        key: { type: :string }
      },
      required: [:user_id, :key]
    }
  },
  required: [:text, :pushover]
}
Block.create!(
  name: "phone_notification",
  description: "Use Pushover (https://pushover.net/) to send a notification to a user's phone",
  github_repo: "graysonwright/pushover.block",
  schema: pushover_schema,
  user: user,
)

transform_schema = {
  type: :object,
  required: [],
  properties: {
    "_transform" => {
      type: :object,
      required: [:source, :destination],
      properties: {
        source: {type: :string},
        destination: {type: :string},
      },
    },
  },
}
Block.create!(
  name: "transform",
  description: "Takes input data, and outputs the same data with some of the data renamed.",
  github_repo: "graysonwright/transform_data.block",
  schema: transform_schema,
  user: user,
)

# Create time-based feeds
time_based_schema = {
  type: :object,
  properties: {
    time: { type: :string },
  },
  required: [:time],
}

Feed.create!(name: "Every Week", schema: time_based_schema)
Feed.create!(name: "Every Day", schema: time_based_schema)
Feed.create!(name: "Every Hour", schema: time_based_schema)
Feed.create!(name: "Every Minute", schema: time_based_schema)
