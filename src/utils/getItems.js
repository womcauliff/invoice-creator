import axios from 'axios';
import credentials from './credentials';

async function getItems() {
  const response = await axios({
    url: '/item',
    method: 'GET',
    baseURL: 'https://apidemo.fattlabs.com/',
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentials.token,
      Accept: 'application/json',
    },
    params: {
      sort: 'price',
      order: 'ASC',
    },
  });
  return response;
}

export default getItems;
