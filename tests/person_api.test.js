const { test, after, beforeEach } = require('node:test')
const assert = require("node:assert");
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "ABC",
        author: "ABC",
        url: "http://www.abc.com",
        likes: 300
    },
    {
        title: "EFG",
        author: "EFG",
        url: "http://www.efg.com",
        likes: 500
    },
  ]

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })

test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})
  
test.only('the first blog is about ABC', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(e => e.title)
    assert(contents.includes('ABC'))
})