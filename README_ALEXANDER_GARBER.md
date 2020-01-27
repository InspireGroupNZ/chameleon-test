# README by Alexander Garber

## Observations

### Postgres on production, SQLite3 for development.

Easier to set up on a local machine, but always runs the risk of something working on local that fails in production.

### Failed Sign-in attempt problems

```
GIVEN the user account "test@test.com" does not exist in `users`
WHEN I attempt to log in with "test@test.com"
THEN the POST response status code should be 401
AND the UI should inform the user of a failed Sign-in attempt
```

However:
1. The POST response status code is **200**.
2. The UI gives no indication of any of the following:
   1. Account does not exist.
   2. Wrong email.
   3. Wrong password.


### No OmniAuthentication

```
As a user, 
I want to be able to sign in to the app with my OpenID account

GIVEN I have a Google or Inspire account
WHEN I navigate to the Sign-in page of this app
THEN I should have the option to log in using my Google account or Inspire account to log in to this app
```

I have experience in testing OmniAuthentication, but not enough to confidently apply it to this project in the limited time available.

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

### FRONTEND: Sign-in/Sign-out links

#### Missing features

```
WHEN logged in with a valid account
THEN there should be a "Sign out" link
```

AND

```
WHEN logged out
THEN there should a "Sign in" link.
```

#### Note about the solution

Although one of my top priorities is to upskill in React, the solution below uses the expedient of Rails **View** templates instead of **React**, because I am focusing on the backend, the database, and APIs.

#### Solution

Created the sub-directory `app/views/devise/menu` and two `html.erb` templates:

`app/views/devise/menu/_login_items.html.erb`

```
<% if user_signed_in? %>
  <li>
  <%= link_to('Logout', destroy_user_session_path, method: :delete) %>        
  </li>
<% else %>
  <li>
  <%= link_to('Login', new_user_session_path) %>  
  </li>
<% end %>
```

`app/views/devise/menu/_registration_items.html.erb`

```
<% if user_signed_in? %>
  <li>
  <%= link_to('Edit registration', edit_user_registration_path) %>
  </li>
<% else %>
  <li>
  <%= link_to('Register', new_user_registration_path) %>
  </li>
<% end %>
```

Changed the HTTP method for signing out from DELETE to GET in `config/initializers/devise.rb`:

```ruby
config.sign_out_via = :get
```

Added the templates to `app/views/layouts/application.html.erb`:

```
<ul class="hmenu">
  <%= render 'devise/menu/registration_items' %>
  <%= render 'devise/menu/login_items' %>
</ul>
<%= yield %>
```

And added some menu styling to `app/assets/stylesheets/application.css` to make links slightly less ugly:

```
ul.hmenu {
  list-style: none;	
  margin: 0 0 2em;
  padding: 0;
}

ul.hmenu li {
  display: inline;  
}
```

#### Result
1. Link on the home page to sign in as a valid user
2. Link available to sign out of a session
3. Easier for me to observe the sign-in and sign-out API calls.

### DATABASE: `TodoItem.content` should not accept "null"

```
As a User,
GIVEN I have not entered text in the <textarea>
WHEN I click the "Create" button
THEN a new Todo item should NOT be created
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

The consequence of `t.string content` not including `null: false` is demonstrated in the file *README_ALEXANDER_GARBER_ADDENDUM.md* in RSpec, cURL, the Rails Console, and the Dev Tools Network history.

#### Attempted Fix: Database Migration

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


### BACKEND: Service Objects for `TodoItemsController`

The changes to the backend address the following two User Stories:

```
As a User,
GIVEN I have not entered text in the <textarea>
WHEN I click the "Create" button
THEN a new Todo item should NOT be created
```

AND 

```
As a developer,
In order to keep my Controllers from getting fat,
I want to keep the bulk of the logic in Service Objects,
And call the Service Objects from the Controllers.
```

#### Service Objects

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

#### Pass `NULL` to the database instead of an empty string

`TodoItemsController#create` needs to pass `todo.content.presence` rather than `todo.content`, in order to ensure that a POST request payload of `{"todo_item":{"content":""}}` is passed to the database as `NULL`.

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

However, because passing `NULL` to the database will raise an error, we need a `#rescue` for when `todo.content.presence` returns `nil`:

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