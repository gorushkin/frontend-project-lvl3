import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import getData from './getData';
import validateUrl from './validateUrl';
import { renderFeeds, renderStatus } from './renderData';
import changeFormStatus from './changeFormStatus';
import { en } from './locales';
import getItems from './getItems';
// import updateFeeds from './updateFeeds';

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
    update: false,
    form: {
      data: null,
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
          watchedState.form.data = data;
          watchedState.form.message = i18next.t('loaded');
          elements.form.reset();
          onChange.target(watchedState).form.value = '';
          onChange.target(watchedState).form.isValid = undefined;
          onChange.target(watchedState).form.error = undefined;
          watchedState.form.isFormBlocked = false;
        });
        break;
      }
      case 'form.data': {
        const { data } = watchedState.form;
        if (data) {
          const [feed, items] = getItems(watchedState);
          onChange.target(watchedState).feeds[feed.index] = feed;
          watchedState.items = [...items, ...watchedState.items];
          watchedState.update = true;
        }
        break;
      }
      case 'items': {
        const { items, feeds } = watchedState;
        console.log(watchedState);
        renderFeeds(feeds, items);
        // watchedState.update = true;
        // setTimeout(() => {
        //   console.log('updating');
        //   watchedState.feeds.forEach((feed) => {
        //     onChange.target(watchedState).form.value = feed.url;
        //     getData(feed.url).then((data) => {
        //       watchedState.form.data = data;
        //     });
        //   });
        // }, 5000);
        break;
      }
      case 'update': {
        if (watchedState.update) {
          setTimeout(() => {
            console.log('updating');
            watchedState.feeds.forEach((feed) => {
              onChange.target(watchedState).form.value = feed.url;
              getData(feed.url).then((data) => {
                watchedState.form.data = data;
              });
            });
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
