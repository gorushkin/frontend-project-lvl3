/* eslint no-param-reassign: "error" */

import onChange from 'on-change';
import i18next from 'i18next';
import validateUrl from './validateUrl';
import renderFeeds from './renderFeeds';
import getItems from './getItems';
import { en } from './locales';
import getData from './getData';

const app = () => {
  const resources = en;
  i18next
    .init({
      lng: 'en',
      resources,
    })
    .then(() => {
      const elements = {
        form: document.querySelector('.rss-form'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        input: document.querySelector('input'),
        button: document.querySelector('button'),
      };

      const state = {
        feeds: [],
        posts: [],
        status: 'waiting',
        error: '',
      };

      const renderFeedback = (message) => {
        if (state.status === 'error') {
          elements.input.classList.add('is-invalid');
          elements.feedback.classList.add('text-danger');
        } else {
          elements.input.classList.remove('is-invalid');
          elements.feedback.classList.remove('text-danger');
        }
        elements.feedback.innerHTML = message;
      };

      const updateFeeds = (watchedState) => {
        const { feeds } = watchedState;
        if (feeds.length > 0 && watchedState.status !== 'loading') {
          const promises = feeds
            .map(({ url, id }) => getData(url)
              .then((data) => ({ data, url, id })));
          Promise.all(promises)
            .then((response) => {
              response.forEach(({ data, url, id }) => {
                const { newPosts } = getItems(watchedState, data, url, id);
                watchedState.posts = [...newPosts, ...watchedState.posts];
              });
            })
            .finally(() => {
              setTimeout(() => updateFeeds(watchedState), 5000);
            });
        } else {
          setTimeout(() => updateFeeds(watchedState), 5000);
        }
      };

      const watchedState = onChange(state, (path, value) => {
        switch (path) {
          case 'status': {
            switch (value) {
              case 'waiting': {
                elements.input.disabled = false;
                elements.button.disabled = false;
                break;
              }
              case 'loading': {
                elements.input.disabled = true;
                elements.button.disabled = true;
                break;
              }
              case 'error': {
                renderFeedback(i18next.t(watchedState.error));
                elements.input.disabled = false;
                elements.button.disabled = false;
                break;
              }
              case 'loaded': {
                elements.input.disabled = false;
                elements.button.disabled = false;
                elements.form.reset();
                renderFeedback(i18next.t('loaded'));
                break;
              }
              default: {
                console.log(`Unknown order state: '${value}'!`);
              }
            }
            break;
          }
          case 'posts': {
            renderFeeds(watchedState.feeds, watchedState.posts, elements.feeds);
            break;
          }
          default: {
            console.log(`Unknown order state: '${path}'!`);
          }
        }
      });

      const formHandler = (url) => {
        validateUrl(url, state.feeds)
          .then(() => {
            watchedState.status = 'loading';
            getData(url)
              .then((data) => {
                watchedState.status = 'loaded';
                const { currentFeed: feed, newPosts: posts } = getItems(watchedState, data, url);
                state.feeds = [feed, ...state.feeds];
                watchedState.posts = [...posts, ...watchedState.posts];
              })
              .catch((err) => {
                state.error = err.message;
                watchedState.status = 'error';
              });
          })
          .catch((error) => {
            state.error = error.message;
            watchedState.status = 'error';
          });
      };

      elements.form.addEventListener('submit', (e) => {
        watchedState.status = 'waiting';
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        formHandler(url);
        updateFeeds(watchedState);
      });
    });
};

export default app;
