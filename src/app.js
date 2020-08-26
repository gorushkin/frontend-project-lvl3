import onChange from 'on-change';
import i18next from 'i18next';
import validator from './validator';
import { renderFeed, renderStatus } from './renderFeed';
import addFeed from './addFeed';
import { en } from './locales';

const app = () => {
  const resources = en;
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  });

  const form = document.querySelector('.rss-form');

  const state = {
    value: '',
    list: [],
    isValid: undefined,
    feeds: [],
    items: [],
    message: '',
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'value': {
        console.log(state.value);
        validator(watchedState, i18next);
        break;
      }
      case 'isValid': {
        if (state.isValid) {
          watchedState.list.push(state.value);
          form.reset();
          addFeed(state.value, watchedState);
        }
        break;
      }
      case 'list': {
        break;
      }
      case 'feeds': {
        renderFeed(state);
        watchedState.message = i18next.t('loaded');
        break;
      }
      case 'items': {
        renderFeed(state);
        break;
      }
      case 'message': {
        renderStatus(state);
        watchedState.value = '';
        break;
      }
      case 'feeds.0.pubDate': {
        break;
      }
      default: {
        throw new Error(`Unknown order state: '${path}'!`);
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.value = formData.get('url');
  });
};

export default app;
