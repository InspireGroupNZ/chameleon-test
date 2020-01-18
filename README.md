# Chameleon Creator Code Challenge Ruby on Rails 

-------------------------------------------------------------------
## Part 1 - Code Challenge

## Jot down 2 - 3 points that you like about it, or has been done well, and why

- All controllers are rending json objects of the Todo Items - functioning as a Rails API feeding to the front-end.
  This is something I am yet to try with rails, but looks fascinating and quite powerful. 

- React Front-End Integrated with TypeScript, pulling the JSON data to popluate the fields.
  The code looks very clean and verbose with TypeScript being statically typed. I imagine this will also make development easier and faster to implement, with less bugs.
  I am currently learning React, and TypeScript is on my list to learn next. 

## Jot down 2 - 3 points about what you would do to make the app better without adding any new features and why.

- I would add a string length validation on the TodoItem model, to ensure the Todo Items don't become too large
- Have a seed data file, purely for faster testing in Development.

## Part 2 - Code Challenge

My working:
React Hooks were implemented via todos, setTodos, newText and setNewText - which I am still to learn.
As I have not used TypeScript as of yet, I have been unable to implement the Delete Functionality.
I have a basic understanding of React, and my results in implementing the Delete Button were two Todo items being deleted, but not saved to the DB.
I have the Delete Button created, calling deleteTodo on click event. 
I can see deleteTodo function is finding the ID of the todo item and removing it via slice. The difficulty I had was connecting this logic to the delete button using TypeScript/React.

As a alternative, I have created the front end using ERB and my rails knowledge.

I have implemented the full CRUD functionality as well as the ability to search.

I hope this is acceptable and demonstrates my knowledge of Rails. I am currently working to increase my React knowledge and aiming to start learning TypeScript shortly.

___________________________________________________________________

This is a ruby on rails code challenge. It is a simple todo application. 

## Installation

standard rails using 6.0.2.1. Make sure you have node >= 10 installed to run webpack which is needed from 
the front end.

basic install:

```
bundle install 
yarn install 
rails s 
```
---

it uses the basic rails new with webpack=react and a couple of front end library and devise for auth.

The challenge involves 2 parts, a quick read and understand and a small amount of coding. We are looking 
to see how well you can understand and work with rails, and also how you think about what you are doing.

## Part 1. 

Spend 10 - 15 mins (short) and read through the app and get an understanding of what is going on. 

Jot down 2 - 3 points that you like about it, or has been done well, and why

Jot down 2 - 3 points about what you would do to make the app better without adding any new features and why. 

## Part 2. 

Fork the repo and create a new branch. 

Implement 1 or more feature of your choice. Don't spend more than hour or so on it, 
just enough so that you think you have showed us what you can do. 

some suggestions include

- enable the ability to delete a todo
- create an admin user that can see all users todos 
- provide a search capability todo's

but you can do whatever you think provides value. 

You can submit a question as an issue on the github

once you have finished, submit a pull request. 

NOTE: if you can't get it running, just write some code and pretend that it works. 
more interested in seeing your code rather than having working code. 