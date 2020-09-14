/* eslint no-param-reassign: "error" */

export default (feeds, posts, container) => {
  const fragment = feeds.map(({ title, id }) => {
    const feedTitle = `<h2>${title}</h2>`;
    const nodes = posts
      .filter((post) => post.feedId === id)
      .map((element) => `<div><a href="${element.link}">${element.title}</a></div>`);
    return [feedTitle, nodes.join('')].join('\n');
  });
  container.innerHTML = fragment;
};
