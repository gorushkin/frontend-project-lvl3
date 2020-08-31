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
  const fragment = [];
  feeds.forEach(({ title, id }) => {
    const feedTitle = `<h2>${title}</h2>`;
    const nodes = items
      .filter((item) => item.feedId === id)
      .map((element) => `<div><a href="${element.link}">${element.title}</a></div>`);
    fragment.push(feedTitle);
    fragment.push(nodes.join(''));
  });
  container.innerHTML = fragment.join('');
};
