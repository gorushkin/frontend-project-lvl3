export default ({ feeds, items }) => {
  const container = document.querySelector('.container');
  container.innerHTML = '';
  const containerInner = document.createElement('div');
  feeds.forEach(({ title, id }) => {
    const feedTitle = document.createElement('h2');
    feedTitle.textContent = title;
    containerInner.appendChild(feedTitle);
    items
      .filter((item) => item.feedId === id)
      .forEach((element) => {
        const node = document.createElement('div');
        node.innerHTML = `<a href="${element.link}">${element.title}</a>`;
        containerInner.appendChild(node);
      });
  });
  container.appendChild(containerInner);
};
