import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  const feedTitle = parsedData.querySelector('title').textContent;
  const feedId = _.uniqueId();
  const feed = { title: feedTitle, id: feedId };
  const itemList = parsedData.querySelectorAll('item');
  const items = [];
  itemList.forEach((feedItem) => {
    const title = feedItem.querySelector('title').textContent;
    const link = feedItem.querySelector('link').textContent;
    const description = feedItem.querySelector('description').textContent;
    const itemId = _.uniqueId();
    const item = {
      title,
      id: itemId,
      feedId,
      link,
      description,
    };
    items.push(item);
  });
  // console.log(items);
  return { feed, items };
};
