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

  return i18next
    .init({
      lng: 'en',
      resources,
    })
    .then((t) => {
      const updateInterval = 15000;
      const elements = {
        form: document.querySelector('.rss-form'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        input: document.querySelector('input'),
        button: document.querySelector('button'),
      };

      const state = {
        feeds: [{ title: 'dsfadsf' }],
        posts: [],
        formStatus: 'idle',
        downloadingStatus: 'idle',
        error: '',
      };

      const updateFeeds = (watchedState) => {
        const { feeds } = watchedState;
        if (feeds.length > 0 && watchedState.downloadingStatus !== 'loading') {
          const promises = feeds
            .map(({ url, id }) => getData(url)
              .then((data) => ({ data, url, id })));
          Promise.all(promises)
            .then((response) => {
              response.forEach(({ data, url, id }) => {
                const { postsWithId: posts } = getItems(watchedState.posts, data, url, id);
                watchedState.posts = [...posts, ...watchedState.posts];
              });
            })
            .finally(() => {
              setTimeout(() => updateFeeds(watchedState), updateInterval);
            });
        } else {
          setTimeout(() => updateFeeds(watchedState), updateInterval);
        }
      };

      const watchedState = onChange(state, (path, value) => {
        switch (path) {
          case 'formStatus': {
            switch (value) {
              case 'idle': {
                elements.input.disabled = false;
                elements.button.disabled = false;
                elements.form.reset();
                break;
              }
              case 'submitting': {
                elements.input.disabled = true;
                elements.button.disabled = true;
                break;
              }
              case 'error': {
                elements.input.disabled = false;
                elements.button.disabled = false;
                elements.input.classList.add('is-invalid');
                elements.feedback.classList.add('text-danger');
                break;
              }
              default: {
                console.log(`Unknown order state: '${value}'!`);
              }
            }
            break;
          }
          case 'downloadingStatus': {
            switch (value) {
              case 'error': {
                elements.input.classList.add('is-invalid');
                elements.feedback.classList.add('text-danger');
                break;
              }
              case 'loading': {
                elements.input.classList.remove('is-invalid');
                elements.feedback.classList.remove('text-danger');
                break;
              }
              case 'loaded': {
                elements.input.classList.remove('is-invalid');
                elements.feedback.classList.remove('text-danger');
                break;
              }
              default: {
                console.log(`Unknown order state: '${value}'!`);
              }
            }
            break;
          }
          case 'error': {
            elements.feedback.innerHTML = t(watchedState.error);
            break;
          }
          case 'feeds': {
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
        validateUrl(url, watchedState.feeds)
          .then(() => {
            watchedState.formStatus = 'submitting';
            watchedState.downloadingStatus = 'loading';
            watchedState.error = 'loading';
            getData(url)
              .then((data) => {
                watchedState.downloadingStatus = 'loaded';
                watchedState.error = 'loaded';
                watchedState.formStatus = 'idle';
                const { currentFeed: feed, postsWithId: posts } = getItems(
                  watchedState.posts,
                  data,
                  url,
                );
                watchedState.feeds = [feed, ...watchedState.feeds];
                watchedState.posts = [...posts, ...watchedState.posts];
              })
              .catch((error) => {
                watchedState.error = error.message;
                watchedState.downloadingStatus = 'error';
                watchedState.formStatus = 'error';
              });
          })
          .catch((error) => {
            watchedState.error = error.message;
            watchedState.formStatus = 'error';
          });
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        formHandler(url);
        // updateFeeds(watchedState);
      });
    });
};

export default app;
