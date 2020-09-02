/* eslint no-param-reassign: "error" */

import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import validateUrl from './validateUrl';
import renderMessage from './renderMessage';
import renderFeeds from './renderFeeds';
import changeFormStatus from './changeFormStatus';
import getItems from './getItems';
import { en } from './locales';
import getData from './getData';

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
  };

  const state = {
    feeds: [],
    posts: [],
    status: 'filling',
  };

  const updateFeedInfo = (feed, posts, watchedState, url) => {
    const feedIndex = _.findIndex(watchedState.feeds, { url });
    onChange.target(watchedState).feeds[feedIndex] = feed;
    watchedState.posts = [...posts, ...watchedState.posts];
  };

  const updateFeeds = (watchedState) => {
    const { feeds } = watchedState;
    setTimeout(() => {
      if (feeds.length > 0 && watchedState.status !== 'loading') {
        feeds.forEach((feed) => {
          console.log(feed);
          const { url } = feed;
          getData(url)
            .then((data) => {
              const [updatedFeed, posts] = getItems(feeds, data, url);
              updateFeedInfo(updatedFeed, posts, watchedState, url);
              updateFeeds(watchedState);
            })
            .catch(() => {
              updateFeeds(watchedState);
            });
        });
      } else {
        updateFeeds(watchedState);
      }
    }, 5000);
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'status': {
        switch (value) {
          case 'filling': {
            elements.form.reset();
            changeFormStatus(elements.input, elements.button, watchedState.status);
            break;
          }
          case 'loading': {
            changeFormStatus(elements.input, elements.button, watchedState.status);
            break;
          }
          case 'error': {
            break;
          }
          case 'loaded': {
            changeFormStatus(elements.input, elements.button, watchedState.status);
            break;
          }
          default: {
            console.log(`Unknown order state: '${value}'!`);
          }
        }
        break;
      }
      case 'feeds': {
        break;
      }
      case 'posts': {
        renderFeeds(watchedState.feeds, watchedState.posts);
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
        watchedState.feeds = [{ url }, ...watchedState.feeds];
        watchedState.status = 'loading';
        getData(url)
          .then((data) => {
            watchedState.status = 'loaded';
            renderMessage(
              i18next.t('loaded'),
              watchedState.status,
              elements.feedback,
              elements.input,
            );
            watchedState.status = 'filling';
            const [feed, posts] = getItems(watchedState.feeds, data, url);
            updateFeedInfo(feed, posts, watchedState, url);
          })
          .catch((err) => {
            watchedState.status = 'error';
            renderMessage(
              err.message,
              watchedState.status,
              elements.feedback,
              elements.input,
            );
            watchedState.status = 'filling';
          });
      } else {
        watchedState.status = 'error';
        renderMessage(i18next.t(result), watchedState.status, elements.feedback, elements.input);
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
};

const initLanguagePack = () => {
  const resources = en;
  i18next
    .init({
      lng: 'en',
      debug: true,
      resources,
    })
    .then(() => app());
};

export default initLanguagePack;
