import onChange from 'on-change';
import validator from './validator';
import { renderFeed, renderStatus } from './renderFeed';
import addFeed from './addFeed';

const app = () => {
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');

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
        validator(state, watchedState);
        break;
      }
      case 'isValid': {
        if (state.isValid) {
          watchedState.list.push(state.value);
          watchedState.isValid = undefined;
          form.reset();
          addFeed(state.value, watchedState);
          onChange.target(watchedState).value = '';
          input.classList.remove('invalid');
        } else {
          input.classList.add('invalid');
        }
        break;
      }
      case 'list': {
        break;
      }
      case 'feeds': {
        renderFeed(state);
        watchedState.message = 'Rss has been loaded';
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
      default: {
        console.log(path);
        console.log('error');
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
