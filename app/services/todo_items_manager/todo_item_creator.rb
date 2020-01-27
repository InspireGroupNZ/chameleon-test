module TodoItemsManager
  class TodoItemCreator < ApplicationService
    attr_reader :current_user, :todo_item_params
    
    def initialize(user_obj, todo_item_params)
      @current_user = user_obj
      @todo_item_params = todo_item_params
    end
    
    def call
      todo = TodoItem.new(@todo_item_params)
      # Ensure that an empty string is passed to SQLite3 as NULL
      todo.content = todo.content.presence
      @current_user.todo_items << todo
      todo
    end
  end
end

