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

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save() 
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save() 
})

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    blogsInDb,
    initialBlogs
}