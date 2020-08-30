import _ from 'lodash';
import getData from './getData';
import parseData from './parseData';

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

const updateFeed = (feeds) => {
  const updatedInfo = feeds.map((feed) => {
    console.table(feed);
    const { url, pubDate: lastFeedUpdateDate, id } = feed;
    const updatedFeedInfoAndFeedItems = getData(url).then((data) => {
      const { items } = parseData(data);
      const onlyNewItems = items
        .filter((item) => item.pubDate > lastFeedUpdateDate)
        .map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
      const newFeedUpdateDate = getlastUpdateDate(onlyNewItems, lastFeedUpdateDate);
      return { onlyNewItems, newFeedUpdateDate };
    });
    return updatedFeedInfoAndFeedItems;
  });
  return updatedInfo;
};

export default updateFeed;
