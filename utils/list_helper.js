const dummy = (blogs) => {
    return 1;
}

const totalLikes = (array) => {

    const reducer = (sum, item) => {
        console.log(item, 'items data type: ')
        return sum + item.likes
    }
      
    return array.reduce(reducer, 0)
    
}

const favouriteBlog = (array) => {
    const max = array.reduce((previous, current) => (previous.likes > current.likes) 
    ? previous 
    : current)
    return max
}
  
module.exports = {
   dummy,
   totalLikes,
   favouriteBlog
}