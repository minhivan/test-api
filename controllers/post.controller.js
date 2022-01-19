const axios = require("axios");

const getPosts = async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    //console.log(data)
    return await response.data;
}

const getSinglePosts = async (id) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    //console.log(data)
    return await response.data;
}


const getPostsByUser = async (userId) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    //console.log(data)
    return await response.data;
}

module.exports = {
    getPosts,
    getSinglePosts,
    getPostsByUser
}

// getSinglePosts(1);