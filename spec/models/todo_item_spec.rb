require 'rails_helper'

RSpec.describe TodoItem, type: :model do
  let(:email) { 'hello@helloworld.com' }
  let(:password) { 'password123' }
  let(:user) { User.create!(email: email, password: password) }
  let(:content) { 'Hello, World!' }
  
  it 'should create a todo_item IFF user and content are supplied' do
    expect {TodoItem.create!}.to raise_error(ActiveRecord::RecordInvalid)
    expect {TodoItem.create!(content: "Hello, world!")}.to raise_error(ActiveRecord::RecordInvalid)
    expect {TodoItem.create!(user: user)}.to raise_error(ActiveRecord::NotNullViolation)
  end

  it 'should create a todo_item with content' do
    todo_item = TodoItem.create!(user: user, content: content)
    expect(todo_item.user).to eq(user)
    expect(todo_item.content).to eq(content)
  end
  
end
