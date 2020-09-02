export default (feeds, posts) => {
  const container = document.querySelector('.feeds');
  const fragment = [];
  feeds.forEach(({ title, id }) => {
    const feedTitle = `<h2>${title}</h2>`;
    const nodes = posts
      .filter((post) => post.feedId === id)
      .map((element) => `<div><a href="${element.link}">${element.title}</a></div>`);
    fragment.push(feedTitle);
    fragment.push(nodes.join(''));
  });
  container.innerHTML = fragment.join('');
};
