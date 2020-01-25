# Notes on System

## Things Done Well

## Proposed Improvements

### TodoItem.content should not accept "null"

#### What is the problem?

It is possible to create a useless TodoItem -- one without content.

#### How do we know this?

In `db/schema.rb`, the attribute `content` accepts `null`:

```ruby
create_table "todo_items", force: :cascade do |t|
  t.string "content"
  t.integer "user_id", null: false
  t.datetime "completed_at"
  t.datetime "created_at", precision: 6, null: false
  t.datetime "updated_at", precision: 6, null: false
  t.index ["user_id"], name: "index_todo_items_on_user_id"
end
```

The consequence of `t.string content` not including `null: false` is demonstrated in the file *NOTES_ADDENDUM.md* in RSpec, cURL, and the Rails Console.

#### FIX Part 1: Database Migration

`generate` a migration:

```bash
bundle exec rails g migration make_todo_item_require_content
```

Add **change_column_null** in the migration file:

`db/migrate/20200125025932_make_todo_item_require_content.rb`

```ruby
class MakeTodoItemRequireContent < ActiveRecord::Migration[6.0]
  def change
    change_column_null :todo_items, :content, false
  end
end
```

Run a database migration:

```bash
bundle exec rails db:migrate
```

#### What does the fix achieve?

In the Console, it is no longer possible to create a TodoItem without providing content:


```ruby
irb(main):008:0> TodoItem.create!(user: User.first)
  User Load (0.2ms)  SELECT "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT ?  [["LIMIT", 1]]
   (0.1ms)  begin transaction
  TodoItem Create (0.6ms)  INSERT INTO "todo_items" ("user_id", "created_at", "updated_at") VALUES (?, ?, ?)  [["user_id", 1], ["created_at", "2020-01-25 03:01:45.602203"], ["updated_at", "2020-01-25 03:01:45.602203"]]
   (0.1ms)  rollback transaction
Traceback (most recent call last):
        2: from (irb):8
        1: from (irb):8:in 'rescue in irb_binding'
ActiveRecord::NotNullViolation (SQLite3::ConstraintException: NOT NULL constraint failed: todo_items.content)
```

However, this does not solve the problem that it is possible for the end-user to create an empty Todo, because POST request payload does not send a NULL, but rather an empty string:

```json
{"todo_item":{"content":""}}
```

Which means that `TodoItemsController#create` will pass `''` to the database entry rather than `NULL`.

#### FIX Part 2: TodoItemsController

Therefore, to ensure that an empty string is passed to the database as NULL, even if the UI sends a payload with an empty string, we need to amend the controller too:

`app/controllers/todo_items_controller.rb`

```ruby
def create
  todo = TodoItem.new todo_item_params
  # Ensure that an empty string is passed to SQLite3 as NULL
  todo.content = todo.content.presence
  
  # Ensure that a 204 error rather than a 500 error is returned
  begin
    current_user.todo_items << todo
  rescue Exception
    puts "You tried to create a Todo with an empty string: #{Exception}"
    return Exception
  end
```

#### Backend Solution != Full Stack Solution

 This is a purely backend solution.  It doesn't change the fact that `<button class="css-1e4tton">Create</button>` is active even when the text area is empty: 

```html
<textarea placeholder="what are you trying to achieve" class="css-14ee8ud"></textarea>
```

If a user clicks on Create without typing anything, the front-end will still send a POST request.

However, with these changes in place, the backend ensures the best possible user experience given the current frontend, and should also prompt a conversation between the frontend and backend developers about how to make further improvements, for example:

- Deactive the Create button until the `<textarea>` has some text.
- Add a tooltip over the deactivated button.
- Require a minimum number of characters for the `<textarea>`

