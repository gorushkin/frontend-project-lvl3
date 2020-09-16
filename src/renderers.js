/* eslint no-param-reassign: "error" */

export const renderFeeds = (feeds, container) => {
  const feedElements = feeds.map(({ title, id }) => {
    const feedTitle = `<h2>${title}</h2>`;
    const feedCard = `
    <div class="card">
      <div class="card-header">
        ${feedTitle}
      </div>
      <div data-id=${id} class="card-body"></div>
    </div>
  `;
    return feedCard;
  });
  container.innerHTML = feedElements.join('\n');
};

export const renderPosts = (feeds, posts) => {
  feeds.forEach(({ id }) => {
    const currentFeedPostElements = posts
      .filter((post) => post.feedId === id)
      .map((element) => `<div><a href="${element.link}">${element.title}</a></div>`);
    const currentFeedContainer = document.querySelector(`[data-id='${id}']`);
    currentFeedContainer.innerHTML = currentFeedPostElements.join('\n');
  });
};
