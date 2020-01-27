# PROOFS

The following are different proofs that a TodoItem can be created without any content.

## Rails Console

Using the first User, this means that the following command does not raise an `ActiveRecord::InvalidRecord` error:

```ruby
irb(main):054:0> TodoItem.create!(user: User.first)
  User Load (0.2ms)  SELECT "users".* FROM "users" ORDER BY "users"."id" ASC LIMIT ?  [["LIMIT", 1]]
   (0.1ms)  begin transactionp
  TodoItem Create (0.4ms)  INSERT INTO "todo_items" ("user_id", "created_at", "updated_at") VALUES (?, ?, ?)  [["user_id", 1], ["created_at", "2020-01-25 01:25:59.099969"], ["updated_at", "2020-01-25 01:25:59.099969"]]
   (9.9ms)  commit transaction
=> #<TodoItem id: 38, content: nil, user_id: 1, completed_at: nil, created_at: "2020-01-25 01:25:59", updated_at: "2020-01-25 01:25:59">
```

## RSpec

The following Spec should fail on the third check, but instead passes:

```ruby
RSpec.describe TodoItem, type: :model do
  let(:email) { 'hello@helloworld.com' }
  let(:password) { 'password123' }
  let(:user) { User.create!(email: email, password: password) }
  let(:content) { 'Hello, World!' }
  
  it 'should create a todo_item IFF user and content are supplied' do
    expect {TodoItem.create!}.to raise_error(ActiveRecord::RecordInvalid)
    expect {TodoItem.create!(content: "Hello, world!")}.to raise_error(ActiveRecord::RecordInvalid)
    expect {TodoItem.create!(user: user)}.to raise_error(ActiveRecord::RecordInvalid)
  end
end
```

## cURL

The same action can be repeated via an API call:

```bash
curl --request POST \
  --url http://localhost:3000/api/todo_items \
  --header 'Accept: */*' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Content-Length: 28' \
  --header 'Content-Type: application/json' \
  --header 'Cookie: _todo_session=azjT5wDKN8%2B3LAKad%2BKBDCOw%2ByIqmBn0nKmvB5poeXtn1SpDY18CDD3QPwudxlsQtdzltJw1obcOIZDw0LTowh5ab1du4nl8iwvzBJaf5fD9qEMBviNY8ggxUrpdrbiWm7DDQFsganbn8LeZmgL586cD00mRV3suRt2a%2Fk84eZiEqVQeEA62x4xyi%2B%2F6PMWMzCRmz%2BHxosGVVcYNiz01NqV4hlTnlHO7RYIedAHy5UdtE3IKTqhpsCtpFFekj%2BUV55%2FLXK%2FrWg%2FQTkqMrsyM%2BOeoGM%2Bt7CbeQdj6Hd8sLS119EvIXNK4D0mH8iMyub0O0t6hKfmrX%2FH1fwp4v0irFwG68JkbpEy9lJxgw6fBz%2FbkDwFHgj4e2cGx1RcVVzFpiqlv9e7gXXDGmt8Mf2Yy2hiTH7XdxF4PRP88I5635kU3ui8mJfuwHJFl0jS00h8y8RHnbJ5sZcrOBy72QNR3JQUCu8rWtNFe6BcY%2BAlGEdjkksViGuwNaAg5BQ0DTtMS4tk90sb%2F6E%2F85SYkvQRDJ8a2Vd4HR2iPDGgudUM%3D--eRjABLCEFyagslOK--3UHzwCSc0g0z8sb4ZS0qBA%3D%3D,_todo_session=azjT5wDKN8%2B3LAKad%2BKBDCOw%2ByIqmBn0nKmvB5poeXtn1SpDY18CDD3QPwudxlsQtdzltJw1obcOIZDw0LTowh5ab1du4nl8iwvzBJaf5fD9qEMBviNY8ggxUrpdrbiWm7DDQFsganbn8LeZmgL586cD00mRV3suRt2a%2Fk84eZiEqVQeEA62x4xyi%2B%2F6PMWMzCRmz%2BHxosGVVcYNiz01NqV4hlTnlHO7RYIedAHy5UdtE3IKTqhpsCtpFFekj%2BUV55%2FLXK%2FrWg%2FQTkqMrsyM%2BOeoGM%2Bt7CbeQdj6Hd8sLS119EvIXNK4D0mH8iMyub0O0t6hKfmrX%2FH1fwp4v0irFwG68JkbpEy9lJxgw6fBz%2FbkDwFHgj4e2cGx1RcVVzFpiqlv9e7gXXDGmt8Mf2Yy2hiTH7XdxF4PRP88I5635kU3ui8mJfuwHJFl0jS00h8y8RHnbJ5sZcrOBy72QNR3JQUCu8rWtNFe6BcY%2BAlGEdjkksViGuwNaAg5BQ0DTtMS4tk90sb%2F6E%2F85SYkvQRDJ8a2Vd4HR2iPDGgudUM%3D--eRjABLCEFyagslOK--3UHzwCSc0g0z8sb4ZS0qBA%3D%3D; _todo_session=AXfyJT8GQiLa2YqH8ZYkT%2BzCuabedzgs%2BPQatHRjR62V1LOuZVaad5tvonOVMRqHKX1%2B1ZM6qeX7nIhf2q%2Bpcuq2vRs4r6nzbNu8qx2NM33BV8GUD54dirI3Dyc7VdThew5AYg9LFQQMf3YyTxtwyAIpSgVqjJDiZyielIkky4wycXDsI%2BONd7YCXNLQEJRJ4yHVD%2F23bgLf6Y6QoF95eqslkztJg8e7lfsCoSaWfsBuPz1aBQ40IwOElxkxtyZpfRrD0aecYvDFYDwyQMLLpQRDj6IJzWgZ%2BIwE5qzr9R1bA%2BV%2FIqpdmY0Nz4MdItS%2BiQO%2FwYwzKBfpgUsFIkrcKnnL0v2vp1URgeDXkkQelRWml8p5LVmva7CWeF7vfepWs8xHYJ%2FIArakCDHbbKRSxWNmg91DYZKH6TohZdW7cq0Zb%2BZY3dPt3YW2TlnQQ%2FuRH57D9Cpn3RzWPArYn29svfP4IGOxRISE%2Fri%2ByAS3K6kERXWZ7Bh%2ByqWz%2F0KJbBgyy6kmjOq5I4yOp7HWHgxBhBjp0zbl3WOfvdV7sG4%3D--hLq6qU%2Be%2Fff2K%2B5b--ImrKNz9Qbkxw%2FalV%2FEY3IQ%3D%3D' \
  --header 'Host: localhost:3000' \
  --header 'Origin: http://localhost:3000' \
  --header 'Postman-Token: 4e45ed57-3c05-4a41-8c82-b298ccea2c63,19073c0f-9a7a-4549-b8d5-8698cb7249a6' \
  --header 'Sec-Fetch-Mode: cors' \
  --header 'Sec-Fetch-Site: same-origin' \
  --header 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36' \
  --header 'X-CSRF-Token: a7aNoz8vAyjnjSj0uUAqJ9FR+9o/FWhT7WQmXlAdjcLZtLgwByFraHnPgkPmWcaDu8oAKNjC5f4wNGD/KX/kAA==' \
  --header 'cache-control: no-cache' \
  --data '{"todo_item":{"content":""}}'
```

## Dev Tools Network History

And it can even be performed in the UI, where if a logged-in user clicks Create, an empty Todo item is added to the screen with the following POST response:

```json
{"id":40,"content":"","user_id":1,"completed_at":null,"created_at":"2020-01-25T01:30:29.499Z","updated_at":"2020-01-25T01:30:29.499Z"}
```