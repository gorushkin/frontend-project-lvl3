export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  const feedTitle = parsedData.querySelector('title').textContent;
  const itemList = parsedData.querySelectorAll('item');
  const items = [];
  itemList.forEach((listItem) => {
    const title = listItem.querySelector('title').textContent;
    const link = listItem.querySelector('link').textContent;
    const description = listItem.querySelector('description').textContent;
    const item = { title, link, description };
    items.push(item);
  });
  const feed = { feedTitle, items };
  return feed;
};
