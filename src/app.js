import onChange from 'on-change';
import i18next from 'i18next';
// import _ from 'lodash';
// import getData from './getData';
import validateUrl from './validateUrl';
// import { renderFeeds, renderStatus } from './renderData';
// import changeFormStatus from './changeFormStatus';
// import getItems from './getItems';
import { en } from './locales';

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
  };

  const state = {
    feeds: [{ url: 'https://mobile-review.com/rss.xml' }],
    items: [],
    status: '',
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'status': {
        console.log('status: ', value);
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
        console.log('ураааааа!!!');
        watchedState.status = 'submit';
      }
    });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    formHandler(url);
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
