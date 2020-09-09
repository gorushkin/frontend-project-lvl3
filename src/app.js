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
        formStatus: 'idle',
        downloadingStatus: 'idle',
        error: '',
      };

      const renderFeedback = (message) => {
        if (message instanceof Error) {
          elements.input.classList.add('is-invalid');
          elements.feedback.classList.add('text-danger');
          elements.feedback.innerHTML = t(message.message);
        } else {
          elements.input.classList.remove('is-invalid');
          elements.feedback.classList.remove('text-danger');
          elements.feedback.innerHTML = t(message);
        }
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
              setTimeout(() => updateFeeds(watchedState), 5000);
            });
        } else {
          setTimeout(() => updateFeeds(watchedState), 5000);
        }
      };

      const watchedState = onChange(state, (path, value) => {
        switch (path) {
          case 'formStatus': {
            switch (value) {
              case 'idle': {
                elements.input.disabled = false;
                elements.button.disabled = false;
                // elements.form.reset();
                break;
              }
              case 'submitted': {
                elements.input.disabled = true;
                elements.button.disabled = true;
                break;
              }
              case 'error': {
                renderFeedback(watchedState.error);
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
                renderFeedback(watchedState.error);
                break;
              }
              case 'loaded': {
                renderFeedback('loaded');
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
        validateUrl(url, watchedState.feeds)
          .then(() => {
            watchedState.formStatus = 'submitted';
            watchedState.downloadingStatus = 'loading';
            getData(url)
              .then((data) => {
                watchedState.downloadingStatus = 'loaded';
                watchedState.formStatus = 'idle';
                const { currentFeed: feed, postsWithId: posts } = getItems(
                  watchedState.posts,
                  data,
                  url,
                );
                watchedState.feeds = [feed, ...watchedState.feeds];
                watchedState.posts = [...posts, ...watchedState.posts];
              })
              .catch((err) => {
                console.log('err: ', err);
                watchedState.error = err;
                watchedState.downloadingStatus = 'error';
                watchedState.formStatus = 'idle';
              });
          })
          .catch((error) => {
            watchedState.error = error;
            watchedState.formStatus = 'error';
          });
      };

      elements.form.addEventListener('submit', (e) => {
        watchedState.downloadingStatus = 'idle';
        watchedState.formStatus = 'idle';
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        formHandler(url);
        updateFeeds(watchedState);
      });
    });
};

export default app;
