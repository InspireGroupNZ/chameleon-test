import * as React from 'react'
import { ThemeProvider } from 'theme-ui'
import theme from './theme'
import {
  Heading,
  Box,
  Textarea,
  Button,
  Container,
  Checkbox,
  Flex,
  Label
} from '@theme-ui/components'

interface Todo {
  id?: number
  content: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export const App = () => {
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [newText, setNewText] = React.useState<string>("")

  React.useEffect(() => {
    fetch("/api/todo_items")
      .then((r) => r.json())
      .then((t) => setTodos(t as any))
  }, [])

  const createTodo = (todo) => {
    return fetch("/api/todo_items", {
      method: 'POST',

      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ todo_item: todo })
    })
      .then(r => r.json())
      .then(todo => {
        setTodos((s) => [...s, todo])
      })
  }

  const deleteTodo = (todo) => {
    return fetch(`/api/todo_items/${todo.id}`, {
      method: 'DELETE',
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
      .then(r => r.json)
      .then((todo: any) => {
        setTodos((s) => {
          let t = s.find((v) => v.id === todo.id)
          let i = s.indexOf(t);
          return s.slice(i)
        })
      })
  }

  const completeTodo = (todo, isC) => {

    return fetch(`/api/todo_items/${todo.id}`, {
      method: 'PUT',

      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ todo_item: { ...todo, completed_at: isC ? new Date(Date.now()).toISOString() : undefined } })
    })
      .then(r => r.json())
      .then(todo => {
        setTodos((s) => {
          let t = s.find((v) => v.id === todo.id)
          let i = s.indexOf(t);
          s[i] = todo
          return [...s]
        })
      })
  }


  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Heading>
          Todo
      </Heading>
        <Box py={3}>
          <Box
            as="ul"
            sx={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {todos.map((t) => {
              return (
                <Flex key={t.id} as='li' py={2} sx={{ alignItems: 'center', textDecoration: !!(t as any).completed_at ? "line-through" : "none" }}>
                  <span><Label>
                    <Checkbox checked={!!(t as any).completed_at} onChange={(e) => {
                      completeTodo(t, e.target.checked)
                    }} /></Label></span>
                  {t.content}
                </Flex>
              )
            })}
          </Box>
        </Box>
        <Box>
          <Textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={"what are you trying to achieve"}
            sx={{
              maxWidth: 420,
              borderRadius: 2,
            }}
          />
          <Button mt={2} onClick={() => createTodo({ content: newText }).then(() => setNewText(""))}>
            Create
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  )
}