# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  let(:email) { 'hello@helloworld.com' }
  let(:password) { 'password123' }

  it 'should create a user IFF email AND password are supplied' do
    expect { User.create! }.to raise_error(ActiveRecord::RecordInvalid)
    expect { User.create! email: email }.to raise_error(ActiveRecord::RecordInvalid)
    expect { User.create! password: password }.to raise_error(ActiveRecord::RecordInvalid)
    expect { User.create! email: email, password: password }.not_to raise_error
  end

  it 'should create a user with email and password' do
    user = User.create! email: email, password: password
    expect(user.email).to eq(email)
    expect(user.password).to eq(password)
  end
end
