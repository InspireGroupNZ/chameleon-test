# BACKEND CHANGES

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

## Service Objects

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

## Pass `NULL` to the database instead of an empty string

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

## Backend Solution != Full Stack Solution

 This is a purely backend solution.  It doesn't change the fact that `<button class="css-1e4tton">Create</button>` is active even when the text area is empty: 

```html
<textarea placeholder="what are you trying to achieve" class="css-14ee8ud"></textarea>
```

If a user clicks on Create without typing anything, the front-end will still send a POST request.

However, with these changes in place, the backend ensures the best possible user experience given the current frontend, and should also prompt a conversation between the frontend and backend developers about how to make further improvements, for example:

- Deactive the Create button until the `<textarea>` has some text.
- Add a tooltip over the deactivated button.
- Require a minimum number of characters for the `<textarea>`