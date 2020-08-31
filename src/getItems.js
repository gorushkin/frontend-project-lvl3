import _ from 'lodash';
import parseData from './parseData';

export default (feeds, data, url) => {
  const { feed, items } = parseData(data);
  const currenFeedUpdateTime = feed.pubDate;
  const feedIndex = _.findIndex(feeds, { url });
  const currentFeed = { ...feeds[feedIndex] };
  const id = currentFeed.id ? currentFeed.id : _.uniqueId();
  const currentPreviousPubDate = currentFeed.previousPubDate;
  const itemsWithId = items.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
  const updatedCurrentFeed = {
    ...currentFeed,
    ...feed,
    id,
    index: feedIndex,
  };
  if (!currentPreviousPubDate) {
    updatedCurrentFeed.previousPubDate = feed.pubDate;
    return [updatedCurrentFeed, itemsWithId];
  }
  const onlyNewItems = itemsWithId.filter(
    (item) => new Date(item.pubDate) > new Date(currentPreviousPubDate)
  );
  updatedCurrentFeed.previousPubDate = currenFeedUpdateTime;
  return [updatedCurrentFeed, onlyNewItems];
};
