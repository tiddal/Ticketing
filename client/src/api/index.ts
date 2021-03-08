import axios from 'axios';

const api = ({ req: request }) => {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/',
    headers: request.headers
  });
};

export { api };
