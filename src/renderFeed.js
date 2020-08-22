import { divide } from 'lodash';

export default ({ feeds, items }) => {
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
