class TodoItemsController < ApplicationController

  # Search Logic for the Index Page
  def index
    if params[:query].present?
      @todo_item = TodoItem.where("content LIKE ?", "%#{params[:query]}%")
    else
      @todo_item = TodoItem.all
    end

  end

  def new
    @todo_item = TodoItem.new
  end

  # Create instantiated item and attempt to save
  def create
    @todo_item = TodoItem.new(todo_item_params)
    @todo_item.user = current_user
    if @todo_item.save
      redirect_to todo_item_path(@todo_item)
    else
      render :new
    end

    # todo = TodoItem.new todo_item_params
    # current_user.todo_items << todo

    # render json: todo
  end

  def show
    @todo_item = TodoItem.find(params[:id])
  end

  def edit
    @todo_item = TodoItem.find(params[:id])
    
  end

  # Edit item and attempt to save
  def update
    @todo_item = TodoItem.find(params[:id])
    @todo_item.update(todo_item_params)

    if @todo_item.save
      redirect_to todo_item_path(@todo_item)
    else
      render :edit
    end

    # render json: todo
  end

  def destroy
    @todo_item = TodoItem.find(params[:id]).destroy
    redirect_to root_path

    # render json: todo
  end

  private 

  # Strong Parameters 
  def todo_item_params
    params.require(:todo_item).permit(
      :content, 
      :completed_at
    )
  end
end
