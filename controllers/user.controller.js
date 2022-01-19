const axios = require("axios");



const getUser = async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    //console.log(data)
    return await response.data;
}

const getSingleUser = async (id) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    // console.log(data)
    return await response.data;
}


module.exports = {
    getUser,
    getSingleUser
}