# Observations

## Postgres on production, SQLite3 for development.

Easier to set up on a local machine, but always runs the risk of something working on local that fails in production.

## Failed Sign-in attempt problems

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


## No OmniAuthentication

```
As a user, 
I want to be able to sign in to the app with my OpenID account

GIVEN I have a Google or Inspire account
WHEN I navigate to the Sign-in page of this app
THEN I should have the option to log in using my Google account or Inspire account to log in to this app
```

I have experience in testing OmniAuthentication, but not enough to confidently apply it to this project in the limited time available.

## Test instead of RSpec

RSpec is the only unit testing framework that I am familiar with in Ruby, which is why I added it the Gemfile for my unit tests.

At work, if required, I would use the established testing framework.

## Cursor placement after creating a Todo item

```
As a User
GIVEN I have entered text in the <textarea>
WHEN I click the "Create" button
THEN a new Todo item should be created
AND the cursor should return to the <textarea>
```

Low priority, the cursor can be returned via the keyboard shortcut `LEFT_SHIFT + TAB`.
