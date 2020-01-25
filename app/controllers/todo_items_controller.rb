class TodoItemsController < ApplicationController
  def index
    render json: current_user.todo_items
  end

  def create
    begin
      render json: TodoItemsManager::TodoItemCreator.call(current_user, todo_item_params)
    rescue
      puts "You tried to create a Todo item with an empty string"
    end
  end

  def update
    todo = TodoItemsManager::TodoItemUpdater.call(params, todo_item_params)
    render json: todo
  end

  def destroy
    todo = TodoItemsManager::TodoItemDestroyer.call(params)
    render json: todo
  end

  private 

  def todo_item_params
    params.require(:todo_item).permit(
      :content, 
      :completed_at
    )
  end
end
