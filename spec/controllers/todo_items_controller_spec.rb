require 'rails_helper'

RSpec.describe TodoItemsController, type: :controller do
  let(:email) { 'hello@helloworld.com' }
  let(:password) { 'password123' }
  let(:user) { User.create!(email: email, password: password) }
  let(:content) { 'Hello, World!' }

  # Test fails because it doesn't include the Devise Warden

  it 'should create a Todo Item' do
    post :create, params: {todo_item: {content: content}}
    expect
  end
end
