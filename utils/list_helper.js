const dummy = (blogs) => {
    return 1;
}

const totalLikes = (array) => {

    if(array.length === 0) {
        return 0
    }

    for(const i in array) {
        return array[i].likes;
    }

}
  
module.exports = {
   dummy,
   totalLikes
}