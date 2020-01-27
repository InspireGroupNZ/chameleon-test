module TodoItemsManager
  class TodoItemUpdater < ApplicationService
    attr_reader :current_user, :todo_item_params
    
    def initialize(params, todo_item_params)
      @params = params
      @todo_item_params = todo_item_params
    end
    
    def call
      todo = TodoItem.find(@params[:id])
      todo.update(@todo_item_params)
      
      unless todo_item_params['completed_at']
        todo.completed_at = nil
      end
      
      todo.save!
      todo
    end
  end
end