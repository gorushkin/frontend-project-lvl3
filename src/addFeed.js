import axios from 'axios';
import _ from 'lodash';
import parseData from './parseData';

const getData = (feedUrl) => {
  const getUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;
  const data = axios.get(getUrl(feedUrl));
  return data;
};

const getlastUpdateDate = (items, lastFeedUpdateDate) => {
  if (items.length === 0) return lastFeedUpdateDate;
  let newFeedUpdateDate = items[0].pubDate;
  for (let i = 1; i < items.length; i += 1) {
    if (items[i].pubDate > newFeedUpdateDate) {
      newFeedUpdateDate = items[i].pubDate;
    }
  }
  return newFeedUpdateDate;
};

const updateFeed = (id, state) => {
  const watchedState = state;
  const { feeds } = state;
  const feedIndex = _.findIndex(feeds, { id });
  const currentFeed = feeds[feedIndex];
  const lastFeedUpdateDate = currentFeed.pubDate;
  const { url } = currentFeed;
  getData(url).then((response) => {
    const { data } = response;
    const { items } = parseData(data);
    const onlyNewItems = items
      .filter((item) => item.pubDate > lastFeedUpdateDate)
      .map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
    const newFeedUpdateDate = getlastUpdateDate(onlyNewItems, lastFeedUpdateDate);
    watchedState.items = [...onlyNewItems, ...state.items];
    watchedState.feeds[feedIndex].pubDate = newFeedUpdateDate;
  });
  setTimeout(() => updateFeed(id, state), 15000);
};

const addFeed = (url, watchedState) => {
  const state = watchedState;
  getData(url).then((response) => {
    const { data } = response;
    const { feed, items } = parseData(data);
    const id = _.uniqueId();
    const itemsWithId = items.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
    state.feeds.push({ ...feed, url, id });
    state.items = [...itemsWithId, ...state.items];
    updateFeed(id, state);
  });
};

export default addFeed;
