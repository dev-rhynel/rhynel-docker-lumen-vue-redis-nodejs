import {createServer, Model, Response} from 'miragejs'
import type {Registry, AnyModels, AnyFactories, ModelInstance} from 'miragejs/-types'

// Define interfaces for our models
interface User extends ModelInstance {
  id: string
  email: string
  firstName: string
  lastName: string
  token: string
}

interface Post extends ModelInstance {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
  updatedAt: string
}

// Define the schema type
type AppSchema = Registry<{
  user: User
  post: Post
}, AnyModels, AnyFactories>

export function makeServer({environment = 'development'} = {}) {
  const server = createServer({
    environment,

    models: {
      user: Model.extend<Partial<User>>({}),
      post: Model.extend<Partial<Post>>({}),
    },

    seeds(server) {
      server.create('user', {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        token: 'fake-jwt-token',
      })

      // Create sample posts
      server.createList('post', 10, (i) => ({
        id: `${i + 1}`,
        title: `Post ${i + 1}`,
        content: `This is the content for post ${i + 1}. It contains some sample text to demonstrate the post content.`,
        userId: '1',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      }))
    },

    routes() {
      this.namespace = 'api'

      this.post('/account/auth/login', (schema: AppSchema, request) => {
        const attrs = JSON.parse(request.requestBody)
        const user = schema.findBy('user', {email: attrs.email})

        if (user) {
          return {
            success: true,
            data: {
              token: user.token,
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            },
          }
        }

        return new Response(
          401,
          {},
          {
            success: false,
            message: 'Invalid credentials',
          }
        )
      })

      this.post('/account/auth/register', (schema: AppSchema, request) => {
        const attrs = JSON.parse(request.requestBody)
        const existingUser = schema.findBy('user', {email: attrs.email})

        if (existingUser) {
          return new Response(
            400,
            {},
            {
              success: false,
              message: 'Email already exists',
            }
          )
        }

        const user = schema.create('user', {
          ...attrs,
          token: 'new-user-fake-jwt-token',
        })

        return {
          success: true,
          data: {
            token: user.token,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          },
        }
      })

      this.delete('/account/auth/logout', () => {
        return new Response(200, {}, {success: true})
      })

      // Posts routes
      this.get('/posts', (schema: AppSchema) => {
        return {
          success: true,
          data: schema.all('post'),
        }
      })

      this.get('/posts/:id', (schema: AppSchema, request) => {
        const id = request.params.id
        const post = schema.find('post', id)

        if (post) {
          return {
            success: true,
            data: post,
          }
        }

        return new Response(
          404,
          {},
          {
            success: false,
            message: 'Post not found',
          }
        )
      })

      this.post('/posts', (schema: AppSchema, request) => {
        const attrs = JSON.parse(request.requestBody)
        const post = schema.create('post', {
          ...attrs,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        return {
          success: true,
          data: post,
        }
      })

      this.put('/posts/:id', (schema: AppSchema, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const post = schema.find('post', id)

        if (post) {
          const updatedPost = post.update({
            ...attrs,
            updatedAt: new Date().toISOString(),
          })

          return {
            success: true,
            data: updatedPost,
          }
        }

        return new Response(
          404,
          {},
          {
            success: false,
            message: 'Post not found',
          }
        )
      })

      this.delete('/posts/:id', (schema: AppSchema, request) => {
        const id = request.params.id
        const post = schema.find('post', id)

        if (post) {
          post.destroy()
          return {
            success: true,
          }
        }

        return new Response(
          404,
          {},
          {
            success: false,
            message: 'Post not found',
          }
        )
      })
    },
  })

  return server
}
