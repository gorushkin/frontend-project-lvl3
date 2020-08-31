import axios from 'axios';

export default (feedUrl) => {
  const getUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;

  const data = axios
    .get(getUrl(feedUrl), { timeout: 50000 })
    .then((response) => response.data)
    .catch((err) => {
      console.log(err.code);
      console.log(err.message);
      return null;
    });
  return data;
};
