const { test, after, beforeEach } = require('node:test')
const assert = require("node:assert");
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')

const Blog = require('../models/blog')

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