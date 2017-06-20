Types::Service = GraphQL::ObjectType.define do
  name "Service"
  description "A third-party service that publishes webhook events"

  field :name, !types.String
  field :domain, !types.String
end