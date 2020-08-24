import axios from 'axios';
import parseData from './parseData';
import _ from 'lodash';

const findNewItemsInFeed = (feed, items, watchedState) => {
  const { id } = feed;
  console.log('id: ', id);
  // const lastFeed
  // const { feedId } = feed;
  const newItems = items.filter((item) => {
    // item.pubDate > feedPubDate;
    // console.log('feedPubDate: ', feedPubDate);
    // console.log('item.pubDate: ', item.pubDate);
  });
  // console.log('newItems: ', newItems);
};

const getData = (feedUrl) => {
  const getUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;
  const data = axios.get(getUrl(feedUrl));
  return data;
};

const updateFeed = (id, state) => {
  // const state = watchedState;
  const { feeds } = state;
  const [currentFeed] = feeds.filter((feed) => {
    return feed.id === id;
  });
  const lastFeedUpdate = currentFeed.pubDate;
  const url = currentFeed.url;
  getData(url).then((response) => {
    const { data } = response;
    const { items } = parseData(data);
    const onlyNewItems = items
      .filter((item) => {
        return item.pubDate > lastFeedUpdate;
      })
      .map((item) => {
        item.id = _.uniqueId();
        item.feedId = id;
      });
    console.log(onlyNewItems);
    // state.items = [...onlyNewItems, ...state.items];
    // console.log(state.items);
  });
  setTimeout(() => updateFeed(id, state), 5000);
};

const addFeed = (url, watchedState) => {
  const state = watchedState;
  getData(url).then((response) => {
    const { data } = response;
    const { feed, items } = parseData(data);
    feed.id = _.uniqueId();
    feed.url = url;
    items.map((item) => {
      item.id = _.uniqueId();
      item.feedId = feed.id;
    });
    state.feeds.push(feed);
    state.items = [...items, ...state.items];
    updateFeed(feed.id, state);
  });
};

export default addFeed;
