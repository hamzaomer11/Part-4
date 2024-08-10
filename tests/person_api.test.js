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