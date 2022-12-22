import { default as axios } from "axios";

const Http = axios.create({
  baseURL: "http://localhost:8000/",
});

const regex = /\/handshake/;
const exeptMethods = ["get", "delete", "options"];

Http.interceptors.request.use(
  (req) => {
    const method = req.method.toLocaleLowerCase();

    if (regex.exec(req.url) !== null || exeptMethods.includes(method)) {
      return req;
    }

    const params = req.data;

    console.log(params);

    return req;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default Http;
