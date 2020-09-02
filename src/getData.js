import axios from 'axios';

export default (feedUrl) => {
  const getUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;
  return axios.get(getUrl(feedUrl), { timeout: 5000 }).then((response) => response.data);
};
