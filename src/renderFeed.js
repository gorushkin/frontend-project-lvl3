export const renderStatus = ({ message }) => {
  console.log(message);
  const feedback = document.querySelector('.feedback');
  feedback.innerHTML = message;
};

export const renderFeed = ({ feeds, items }) => {
  console.log('renderFeed');
  console.log('feeds: ', feeds);
  console.log('items: ', items);
  const container = document.querySelector('.feeds');
  container.innerHTML = '';
  feeds.forEach(({ title, id }) => {
    const feedTitle = document.createElement('h2');
    feedTitle.textContent = title;
    container.appendChild(feedTitle);
    items
      .filter((item) => item.feedId === id)
      .forEach((element) => {
        const node = document.createElement('div');
        node.innerHTML = `<a href="${element.link}">${element.title}</a>`;
        container.appendChild(node);
      });
  });
};
