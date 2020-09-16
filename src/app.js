import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import validateUrl from './validateUrl';
import { renderFeeds, renderPosts } from './renderers';
import parseFeeds from './parseFeeds';
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
        feeds: [],
        posts: [],
        formStatus: 'idle',
        downloadingStatus: 'idle',
        error: null,
      };

      const updateFeeds = (watchedState) => {
        if (watchedState.downloadingStatus === 'loading') {
          setTimeout(() => updateFeeds(watchedState), updateInterval);
        } else {
          const promises = watchedState.feeds
            .map(({ url, id }) => getData(url)
              .then((data) => {
                const { posts } = parseFeeds(data);
                const newPosts = _.differenceWith(
                  posts,
                  watchedState.posts,
                  (newPost, oldPost) => newPost.link === oldPost.link,
                );
                const newPostsWithId = newPosts
                  .map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
                watchedState.posts = [...newPostsWithId, ...watchedState.posts];
              }));

          Promise.all(promises).finally(() => {
            setTimeout(() => updateFeeds(watchedState), updateInterval);
          });
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
              case 'failed': {
                elements.input.disabled = false;
                elements.button.disabled = false;
                elements.input.classList.add('is-invalid');
                elements.feedback.classList.add('text-danger');
                break;
              }
              default: {
                throw new Error(`Unknown order state: '${value}'!`);
              }
            }
            break;
          }
          case 'downloadingStatus': {
            switch (value) {
              case 'idle': {
                elements.input.classList.remove('is-invalid');
                elements.feedback.classList.remove('text-danger');
                break;
              }
              case 'failed': {
                elements.input.classList.add('is-invalid');
                elements.feedback.classList.add('text-danger');
                break;
              }
              case 'loading': {
                elements.input.classList.remove('is-invalid');
                elements.feedback.classList.remove('text-danger');
                elements.feedback.innerHTML = t('loading');
                break;
              }
              case 'loaded': {
                elements.input.classList.remove('is-invalid');
                elements.feedback.classList.remove('text-danger');
                elements.feedback.innerHTML = t('loaded');
                break;
              }
              default: {
                throw new Error(`Unknown order state: '${value}'!`);
              }
            }
            break;
          }
          case 'error': {
            elements.feedback.innerHTML = t(watchedState.error);
            break;
          }
          case 'feeds': {
            renderFeeds(watchedState.feeds, elements.feeds);
            break;
          }
          case 'posts': {
            renderPosts(watchedState.feeds, watchedState.posts);
            break;
          }
          default: {
            throw new Error(`Unknown order state: '${path}'!`);
          }
        }
      });

      const formHandler = (url) => {
        validateUrl(url, watchedState.feeds)
          .then(() => {
            watchedState.formStatus = 'submitting';
            watchedState.downloadingStatus = 'loading';
            watchedState.error = null;
            getData(url)
              .then((data) => {
                watchedState.downloadingStatus = 'loaded';
                watchedState.formStatus = 'idle';
                const { feed, posts } = parseFeeds(data);
                const id = _.uniqueId();
                const currentFeed = { ...feed, id, url };
                const postsWithId = posts
                  .map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
                watchedState.feeds = [currentFeed, ...watchedState.feeds];
                watchedState.posts = [...postsWithId, ...watchedState.posts];
                watchedState.error = null;
              })
              .catch((error) => {
                watchedState.error = error.message;
                watchedState.downloadingStatus = 'failed';
                watchedState.formStatus = 'failed';
              });
          })
          .catch((error) => {
            watchedState.error = error.message;
            watchedState.formStatus = 'failed';
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
