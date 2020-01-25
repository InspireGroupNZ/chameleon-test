class MakeTodoItemRequireContent < ActiveRecord::Migration[6.0]
  def change
    change_column_null :todo_items, :content, false
  end
end
