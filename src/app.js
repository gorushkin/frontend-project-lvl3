import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import getFeedsFromSource from './getItemssFromSource';
import validateUrl from './validateUrl';
import { renderFeeds, renderStatus } from './renderData';
import changeFormStatus from './changeFormStatus';
import { en } from './locales';

const app = () => {
  const form = document.querySelector('.rss-form');

  const state = {
    feeds: [],
    items: [],
    form: {
      value: '',
      isValid: null,
      status: '',
      errorCode: '',
      isFormBlocked: false,
    },
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.value': {
        validateUrl(watchedState).then((result) => {
          watchedState.form.errorCode = result;
        });
        break;
      }
      case 'form.isFormBlocked': {
        const { isFormBlocked } = watchedState.form;
        changeFormStatus(form, isFormBlocked);
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
        if (watchedState.form.isValid) {
          const { value } = watchedState.form;
          watchedState.feeds.push({ url: value });
        }
        break;
      }
      case 'feeds': {
        watchedState.form.isFormBlocked = true;
        getFeedsFromSource(watchedState).then(([feed, items]) => {
          const { url } = feed;
          const feedIndex = _.findIndex(watchedState.feeds, { url });
          if (url) onChange.target(watchedState).feeds[feedIndex] = feed;
          watchedState.items = [...watchedState.items, ...items];
          watchedState.form.isFormBlocked = false;
        });
        break;
      }
      case 'items': {
        const { items, feeds } = watchedState;
        renderFeeds(feeds, items);
        break;
      }
      case 'message': {
        renderStatus(state);
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
