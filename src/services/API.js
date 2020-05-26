import axios from 'axios'

export default() => {
    axios.defaults.headers.Authorization = 'Bearer ' + localStorage.getItem('authToken')
    return axios.create({
        baseURL: `http://localhost:8081` // the url of our server
        //baseURL: `https://checkbook.kelecava.xyz/api` // the url of our server
    })
}