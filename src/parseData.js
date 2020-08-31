export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  const feedTitle = parsedData.querySelector('title').textContent;
  const feedLink = parsedData.querySelector('link').textContent;
  const feedPubDate = parsedData.querySelector('pubDate').textContent;
  const feed = { title: feedTitle, link: feedLink, pubDate: feedPubDate };
  const itemList = parsedData.querySelectorAll('item');
  const items = [];
  itemList.forEach((feedItem) => {
    const title = feedItem.querySelector('title').textContent;
    const link = feedItem.querySelector('link').textContent;
    const description = feedItem.querySelector('description').textContent;
    const pubDate = feedItem.querySelector('pubDate').textContent;
    const item = {
      title,
      link,
      description,
      pubDate,
    };
    items.push(item);
  });
  return { feed, items };
};
