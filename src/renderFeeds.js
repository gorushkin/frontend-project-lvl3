/* eslint no-param-reassign: "error" */

export const renderFeeds = (feeds, container) => {
  const fragment = feeds.map(({ title, id }) => {
    const feedTitle = `<a href="#" data-id=${id}>${title}</a>`;
    return feedTitle;
  });
  container.innerHTML = fragment.join('\n');
};

export const renderPosts = (posts, id, container) => {
  const fragment = posts
    .filter((post) => post.feedId === id)
    .map((element) => `<div><a href="${element.link}">${element.title}</a></div>`);
  container.innerHTML = fragment.join('\n');
};
