module TodoItemsManager
  class TodoItemDestroyer < ApplicationService
    attr_reader :current_user, :todo_item_params
    
    def initialize(params)
      @params = params
      # @todo_item_params = todo_item_params
    end
    
    def call
      todo = TodoItem.find(@params[:id])
      todo.destroy
      todo
    end
  end
end