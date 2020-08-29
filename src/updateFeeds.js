import _ from 'lodash';

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

const updateFeed = (watchedState) => {
  const { feeds } = watchedState;
  console.log(feeds);
};

export default updateFeed;
