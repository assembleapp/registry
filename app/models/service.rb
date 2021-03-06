require "authentication_strategy/bitbucket"

class Service < ApplicationRecord
  AUTHENTICATION_STRATEGIES = {
    "bitbucket.org" => AuthenticationStrategy::BitBucket,
    "google.com" => AuthenticationStrategy::Google,
  }

  has_many :triggers, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :domain, presence: true, uniqueness: { case_sensitive: false }

  def parse_oauth_payload(oauth_payload)
    auth_strategy.new(oauth_payload).credentials
  end

  def credential_mapping
    auth_strategy::CREDENTIAL_MAPPING
  end

  private

  def auth_strategy
    AUTHENTICATION_STRATEGIES.fetch(domain)
  end
end
