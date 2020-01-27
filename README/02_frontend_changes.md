# FRONTEND: Sign-in/Sign-out links

## Missing features

```
WHEN logged in with a valid account
THEN there should be a "Sign out" link
```

AND

```
WHEN logged out
THEN there should a "Sign in" link.
```

## Solution

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

## Result

1. Link on the home page to sign in as a valid user
2. Link available to sign out of a session
3. Easier for me to observe the sign-in and sign-out API calls.
