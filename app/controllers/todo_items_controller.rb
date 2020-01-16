class TodoItemsController < ApplicationController
  def index
    render json: current_user.todo_items
  end

  def create
    todo = TodoItem.new todo_item_params
    current_user.todo_items << todo

    render json: todo
  end

  def update
    todo = TodoItem.find params[:id]
    todo.update todo_item_params

    if not todo_item_params["completed_at"]
      todo.completed_at = nil
    end

    todo.save!

    render json: todo
  end

  def destroy
    todo = TodoItem.find params[:id]
    todo.destroy

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
