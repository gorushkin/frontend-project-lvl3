import axios from 'axios';
import parseData from './parseData';

const getData = (feedUrl) => {
  const getUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;
  const data = axios.get(getUrl(feedUrl));
  return data;
};

const addFeed = (url, watchedState) => {
  const state = watchedState;
  console.log('feedUrl', url);
  getData(url).then((response) => {
    const { data } = response;
    const { status } = response;
    console.log('status: ', status);
    const { feed, items } = parseData(data);
    state.feeds.push(feed);
    state.items = [...items, ...state.items];
  });
};

export default addFeed;
