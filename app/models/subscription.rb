class Subscription < ApplicationRecord
  belongs_to :block
  belongs_to :trigger
  belongs_to :user

  validates :block, presence: true
  validates :trigger, presence: true
  validates :user, presence: true

  has_many :events, dependent: :destroy

  def activate
    unless trigger_options_satisfied?
      raise ArgumentError, "missing some required trigger options"
    end

    update(
      remote_webhook_id: service.activate,
      activated_at: Time.current,
      deactivated_at: nil,
    )
  end

  def active?
    activated_at && !deactivated_at
  end

  def authentication
    Authentication.find_by(service: trigger.service, user: user)
  end

  def deactivate
    if(service.deactivate(remote_webhook_id))
      update(deactivated_at: Time.current)
    end
  end

  def record_event(webhook_params)
    event = service.record_event(webhook_params)

    run = BlockRun.create!(
      block: block,
      input: event.data.merge(data_overrides),
      user: user,
      event: event,
    )

    run.delay.execute
    event
  end

  def trigger=(value)
    super(value)
    self.trigger_options = value.default_options
  end

  def destroy
    deactivate if active?
    super
  end

  private

  def trigger_options_satisfied?
    JSON::Validator.validate(trigger.options_schema, trigger_options)
  end

  def service
    @service ||= trigger.strategy.new(self)
  end
end
