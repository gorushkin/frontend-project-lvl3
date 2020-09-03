export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  const feedTitle = parsedData.querySelector('title').textContent;
  const feedLink = parsedData.querySelector('link').textContent;
  const feedPubDate = parsedData.querySelector('pubDate').textContent;
  const feed = { title: feedTitle, link: feedLink, pubDate: feedPubDate };

  const postList = parsedData.querySelectorAll('item');
  const posts = Array.prototype.slice.call(postList).map((feedItem) => {
    const title = feedItem.querySelector('title').textContent;
    const link = feedItem.querySelector('link').textContent;
    const description = feedItem.querySelector('description').textContent;
    const pubDate = feedItem.querySelector('pubDate').textContent;
    const guid = feedItem.querySelector('guid').textContent;
    return {
      title,
      link,
      description,
      pubDate,
      guid,
    };
  });
  return { feed, posts };
};
