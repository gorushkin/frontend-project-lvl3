export const renderStatus = (watchedState, elements) => {
  const { message, isValid } = watchedState.form;
  const { feedback, input } = elements;
  if (isValid) {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
  } else {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
  }
  feedback.innerHTML = message;
};

export const renderFeeds = (feeds, items) => {
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
