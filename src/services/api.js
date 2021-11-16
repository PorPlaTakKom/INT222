import axios from "axios";

const instance = axios.create({
    baseURL: "https://www.tarkom-projects.com/api/v1/",
});

export default instance;
