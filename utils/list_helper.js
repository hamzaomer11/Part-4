const dummy = (blogs) => {
    return 1;
}

const totalLikes = (array) => {

    if(array.length === 0) {
        return 0
    }

    const reducer = (sum, item) => {
        console.log(item, 'items data type: ')
        return sum + item.likes
    }
      
    return array.reduce(reducer, 0)
    
}
  
module.exports = {
   dummy,
   totalLikes
}