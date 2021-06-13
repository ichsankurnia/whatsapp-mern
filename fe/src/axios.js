import axios from "axios";

// export const baseURL = "http://localhost:9000"
export const baseURL = 'https://heroku-node-whatasappbe.herokuapp.com'

const instance = axios.create({
    baseURL: baseURL
})

export default instance