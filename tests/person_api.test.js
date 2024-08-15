const { test, beforeEach} = require('node:test')
const assert = require("node:assert");
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save() 
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save() 
})

test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})
  
test.only('the first blog is about ABC', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(e => e.title)
    assert(contents.includes('ABC'))
})

test.only('the unique id property of the blog posts is named id', async () => {
   const blogs = await helper.blogsInDb()
   blogs.forEach((blog) => {
    assert.notStrictEqual(blog.id, undefined);
   });
})

test.only('a valid blog can be added ', async () => {
    const newBlog = {
        title: "HIJ",
        author: "HIJ",
        url: "http://www.hij.com",
        likes: 200
    }
    
    /** making an HTTP POST request to the /api/blogs URL successfully creates a new blog post */
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    /** verifying that the total number of blogs in the system is increased by one */
    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)
    
    /** verifying that the content of the blog post is saved correctly to the database */
    const titles = blogAtEnd.map(b => b.title)
    assert(titles.includes('HIJ'))
})

test.only('like property defaults to 0 if missing', async () => {
    const newBlog = {
        title: "HIJ",
        author: "HIJ",
        url: "http://www.hij.com",
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogAtEnd = await helper.blogsInDb()
      const blogLikes = blogAtEnd.map(blog => blog.likes)
      assert(blogLikes.includes(0))
})

test.only('respond with 400 bad request if title/url properties are missing', async () => {
    const newBlog = {
        title: "",
        author: "KLM",
        url: "http://www.klm.com",
        likes: 100
    }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)
})

test.only('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogtoDelete = blogsAtStart[0]

    await api
    .delete(`/api/blogs/${blogtoDelete.id}`)
    .expect(204)

    const blogAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length - 1)

    const contents = blogAtEnd.map(blog => blog.title)
    assert(!contents.includes(blogtoDelete.title))
})

test.only('update succeeds with status code 200 if id is valid'), async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .expect(200)

    const blogAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length)

    const contents = blogAtEnd.map(blog => blog.likes)
    assert(contents.includes(blogToUpdate.likes))
}

test.only('invalid user is not created', async () => {
    const newUser = {
        username: "",
        name: "KLM",
        password: ""
    }
        
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        
    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, helper.initialUsers.length)
})

test.only('respond with 400 status-code & error message if invalid user/password is added', async () => {
    const newUser = {
        username: "",
        name: "KLM",
        password: ""
    }
        
    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        
    assert(result.body.error.includes('invalid username or password'))
})