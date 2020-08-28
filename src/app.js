import onChange from 'on-change';
import i18next from 'i18next';
import validateUrl from './validateUrl';
import { renderFeed, renderStatus } from './renderFeed';
import addUrlToFeeds from './addUrlToFeeds';
import { en } from './locales';

const app = () => {
  const form = document.querySelector('.rss-form');
  // const input = form.querySelector('input');

  const state = {
    feeds: [],
    items: [],
    form: {
      value: '',
      isValid: null,
      status: '',
      errorCode: '',
    },
  };

  const watchedState = onChange(state, (path) => {
    console.log(path);
    switch (path) {
      case 'form.value': {
        validateUrl(watchedState).then((result) => {
          watchedState.form.errorCode = result;
        });
        break;
      }
      case 'form.errorCode': {
        if (watchedState.form.errorCode === null) {
          watchedState.form.isValid = true;
        } else {
          watchedState.form.isValid = false;
        }
        onChange.target(watchedState).form.isValid = null;
        onChange.target(watchedState).form.errorCode = '';
        break;
      }
      case 'form.isValid': {
        if (watchedState.form.isValid) addUrlToFeeds(watchedState);
        break;
      }
      case 'feeds': {
        // renderFeed(state);
        console.log(watchedState.feeds);
        // watchedState.message = i18next.t('loaded');
        break;
      }
      case 'items': {
        renderFeed(state);
        break;
      }
      case 'message': {
        renderStatus(state);
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
    watchedState.form.value = formData.get('url');
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
