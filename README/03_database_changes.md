# DATABASE: `TodoItem.content` should not accept "null"

```
As a User,
GIVEN I have not entered text in the <textarea>
WHEN I click the "Create" button
THEN a new Todo item should NOT be created
```
## What is the problem?

In the UI, it is possible to create a useless TodoItem -- one without content -- and `todo_items.content` accepts both an empty string and NULL values.

## How do we know this?

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

The consequence of `t.string content` not including `null: false` is demonstrated in the file *README/05_proofs.md* using RSpec, cURL, the Rails Console, and the Dev Tools Network history.

## Attempted Solution: Database Migration

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

## What Does the Fix Achieve?

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

This means that in `TodoItemsController#create` the variable `todo.content` will be `''` instead of `nil`.

Thus, without further work on `TodoItemsController#create`, it is still possible to create a Todo item via the UI without any content.
