import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import getData from './getData';
import validateUrl from './validateUrl';
import { renderFeeds, renderStatus } from './renderData';
import changeFormStatus from './changeFormStatus';
import { en } from './locales';
import getItems from './getItems';

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
  };

  const state = {
    feeds: [],
    items: [],
    updateStatus: false,
    form: {
      value: '',
      isValid: null,
      error: '',
      message: '',
      isFormBlocked: false,
    },
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.value': {
        validateUrl(watchedState).then((result) => {
          watchedState.form.error = result;
        });
        break;
      }
      case 'form.isFormBlocked': {
        const { isFormBlocked } = watchedState.form;
        changeFormStatus(elements, isFormBlocked);
        break;
      }
      case 'form.error': {
        const { error } = watchedState.form;
        watchedState.form.isValid = !error;
        if (error) watchedState.form.message = i18next.t(error);
        break;
      }
      case 'form.message': {
        renderStatus(watchedState, elements);
        break;
      }
      case 'form.isValid': {
        if (watchedState.form.isValid) {
          const { value } = watchedState.form;
          const { feeds } = watchedState;
          watchedState.feeds = [{ url: value }, ...feeds];
        }
        break;
      }
      case 'feeds': {
        watchedState.form.isFormBlocked = true;
        const { value: url } = watchedState.form;
        getData(url).then((data) => {
          watchedState.form.message = i18next.t('loaded');
          elements.form.reset();
          onChange.target(watchedState).form.value = '';
          onChange.target(watchedState).form.isValid = undefined;
          onChange.target(watchedState).form.error = undefined;
          watchedState.form.isFormBlocked = false;
          const [feed, items] = getItems(watchedState.feeds, data, url);
          const feedIndex = _.findIndex(watchedState.feeds, { url });
          onChange.target(watchedState).feeds[feedIndex] = feed;
          watchedState.items = [...items, ...watchedState.items];
        });
        break;
      }
      case 'items': {
        const { items, feeds } = watchedState;
        renderFeeds(feeds, items);
        watchedState.updateStatus = true;
        break;
      }
      case 'updateStatus': {
        const { feeds } = watchedState;
        if (watchedState.updateStatus) {
          setTimeout(() => {
            feeds.forEach((feed) => {
              const { url } = feed;
              getData(url).then((data) => {
                const [updatedFeed, items] = getItems(feeds, data, url);
                const feedIndex = _.findIndex(watchedState.feeds, { url });
                onChange.target(watchedState).feeds[feedIndex] = updatedFeed;
                watchedState.items = [...items, ...watchedState.items];
              });
            });
            watchedState.updateStatus = false;
          }, 5000);
        }
        break;
      }
      default: {
        throw new Error(`Unknown order state: '${path}'!`);
      }
    }
  });

  elements.form.addEventListener('submit', (e) => {
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
