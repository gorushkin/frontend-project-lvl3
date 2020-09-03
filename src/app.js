/* eslint no-param-reassign: "error" */

import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import validateUrl from './validateUrl';
import renderFeedback from './renderFeedback';
import renderFeeds from './renderFeeds';
import changeFormStatus from './changeFormStatus';
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
        feedback: null,
      };

      const updateFeedInfo = (feed, posts, watchedState, url) => {
        const feedIndex = _.findIndex(watchedState.feeds, { url });
        onChange.target(watchedState).feeds[feedIndex] = feed;
        watchedState.posts = [...posts, ...watchedState.posts];
      };

      const updateFeeds = (watchedState) => {
        const { feeds } = watchedState;
        if (feeds.length > 0 && watchedState.status !== 'loading') {
          const promises = feeds.map(({ url }) => getData(url).then((data) => ({ data, url })));
          Promise.all(promises)
            .then((response) => {
              response.forEach(({ data, url }) => {
                const [updatedFeed, posts] = getItems(watchedState, data, url);
                updateFeedInfo(updatedFeed, posts, watchedState, url);
              });
            })
            .catch(() => {})
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
                elements.form.reset();
                changeFormStatus(elements.input, elements.button, watchedState.status);
                break;
              }
              case 'loading': {
                changeFormStatus(elements.input, elements.button, watchedState.status);
                break;
              }
              case 'error': {
                renderFeedback(i18next.t(watchedState.feedback),
                  watchedState.status,
                  elements.feedback,
                  elements.input);
                break;
              }
              case 'loaded': {
                changeFormStatus(elements.input, elements.button, watchedState.status);
                renderFeedback(
                  i18next.t(watchedState.feedback),
                  watchedState.status,
                  elements.feedback,
                  elements.input,
                );
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
        validateUrl(url, state.feeds).then((result) => {
          if (url === result) {
            state.feeds = [{ url }, ...watchedState.feeds];
            watchedState.status = 'loading';
            getData(url)
              .then((data) => {
                state.feedback = 'loaded';
                watchedState.status = 'loaded';
                watchedState.status = 'waiting';
                const [feed, posts] = getItems(watchedState, data, url);
                updateFeedInfo(feed, posts, watchedState, url);
              })
              .catch((err) => {
                state.feedback = err.message;
                watchedState.status = 'error';
                watchedState.status = 'waiting';
              });
          } else {
            state.feedback = result;
            watchedState.status = 'error';
          }
        });
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        formHandler(url);
        updateFeeds(watchedState);
      });
    });
};

export default app;
