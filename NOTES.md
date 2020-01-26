# Notes on System

## Notable Details

### Postgres on production, SQLite3 for development.

Easier to set up on a local machine, but always runs the risk of something working on local that fails in production.

### Failed login attempt problems

```
GIVEN the user account "test@test.com" does not exist in `users`
WHEN I attempt to log in with "test@test.com"
THEN the POST response status code should be 401
AND the UI should inform the user of a failed login attempt
```

### No logout, user permanently logged in

Login button missing.

```
WHEN logged in with a valid account
THEN there should be a "Log Out" button
```

No way of testing in the UI whether clicking the "Log Out" button would redirect to the login page.
```
GIVEN logged in with a valid account
WHEN I click the "Log Out" button
THEN my authentication token should be invalidated
AND I should be redirected to the login page
```

### No OmniAuthentication

```
As a user, 
I want to be able to sign in to the app with my OpenID account

GIVEN I have a Google or Inspire account
WHEN I navigate to the login page of this app
THEN I should have the option to log in using my Google account or Inspire account to log in to this app
```

### Test instead of RSpec

RSpec is the only unit testing framework that I am familiar with in Ruby, which is why I added it the Gemfile for my unit tests.

At work, if required, I would use the established testing framework.

### Cursor placement after creating a Todo item

```
As a User
GIVEN I have entered text in the <textarea>
WHEN I click the "Create" button
THEN a new Todo item should be created
AND the cursor should return to the <textarea>
```

Low priority, the cursor can be returned via the keyboard shortcut `LEFT_SHIFT + TAB`.

## Improvements

### BACKEND: Use Service Objects for `TodoItemsController`

```
As a developer,
In order to keep my Controllers from getting fat,
I want to keep the bulk of the logic in Service Objects,
And call the Service Objects from the Controllers.
```

I applied this principle to `TodoItemsController`:

1. Create the directory `app/services/todo_items_manager`
2. Create a separate Service Object for each controller instance method
   1. `#create` => `TodoItemsManager::TodoItemCreator`
   1. `#update` => `TodoItemsManager::TodoItemUpdater`
   1. `#destroy` => `TodoItemsManager::TodoItemDestroyer`

Every Service Object class inherits the following method from ApplicationService:

```ruby
class ApplicationService
  def self.call(*args, &block)
    new(*args, &block).call
  end
end
```

Thus all the logic is accessible in a one-line method call, which returns the variable `todo` to be rendered.

For example, within `TodoItemsController#create` this line...

```ruby
render json: TodoItemsManager::TodoItemCreator.call(current_user, todo_item_params)
```

...invokes `TodoItemsManager::TodoItemCreator.call`:

```ruby
def call
  todo = TodoItem.new(@todo_item_params)
  # Ensure that an empty string is passed to SQLite3 as NULL
  todo.content = todo.content.presence
  @current_user.todo_items << todo
  todo
end
```

**NOTE**: this line is the subject of the next proposal.

```ruby
# Ensure that an empty string is passed to SQLite3 as NULL
todo.content = todo.content.presence
```

### `TodoItem.content` should not accept "null"

```
As a User,
GIVEN I have not entered text in the <textarea>
WHEN I click the "Create" button
THEN a new Todo item should NOT be created
AND the cursor should return to the <textarea>
```
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

This means that in `TodoItemsController#create` the variable `todo.content` will be `''` instead of `nil`.

#### FIX Part 2: TodoItemsController

Therefore, `TodoItemsController#create` needs to pass `todo.content.presence` rather than `todo.content`, in order to ensure that a POST request payload of `{"todo_item":{"content":""}}` is passed to the database as `NULL`.

`app/services/todo_items_manager/todo_item_creator.rb`

```ruby
def call
  todo = TodoItem.new(@todo_item_params)
  # Ensure that an empty string is passed to SQLite3 as NULL
  todo.content = todo.content.presence
  @current_user.todo_items << todo
  todo
end
```
Finally, because passing `NULL` to the database will raise an error, we need a `#rescue` for when `todo.content.presence` returns `nil`:

`app/controllers/todo_items_controller.rb`

```ruby
def create
  begin
    render json: TodoItemsManager::TodoItemCreator.call(current_user, todo_item_params)
  rescue
    puts "You tried to create a Todo item with an empty string"
  end
```

This way, if a request is valid, it returns the same **200** response, and if it is invalidated by its empty content, the server will return **204** instead of **500**.

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


