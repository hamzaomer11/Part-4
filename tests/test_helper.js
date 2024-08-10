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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    blogsInDb,
    initialBlogs
}