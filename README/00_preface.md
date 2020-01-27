# Preface

The changes in this pull request effect the following:

1. User Interface
   1. Sign-in link on the home page.
   2. Sign-out link during a session.
   3. Todo item cannot be created without content.
2. Database
   1. Transaction cannot be added to `todo_items` WHERE content is NULL.
1. TodoItems Controller
   1. `#create` passes `todo.content.presence` instead of `todo.content`, thereby raising an error if `todo.content` is an empty string.
   2. Logic of TodoItems Controller is transferred to Service Objects.

Although one of my top priorities is to upskill in React, the UI solution uses the expedient of Rails **View** templates instead of **React**, because I am focusing on the backend, the database, and APIs.  I certainly want to upskill in React, but I didn't want to spend time on a potentially half-baked frontend solution.

On a similar note, I stuck with the existing render logic of the TodoItems controller:

```ruby
render json: todo
```