import onChange from 'on-change';
import validator from './validator';
import renderFeed from './renderFeed';
import addFeed from './addFeed';

const app = () => {
  console.log('app start');
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');

  const state = {
    value: '',
    list: [],
    isValid: undefined,
    feeds: [],
    items: [],
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'value': {
        validator(state).then((result) => {
          if (result) {
            watchedState.isValid = true;
          } else {
            watchedState.isValid = false;
          }
        });
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
        // console.log(state.feeds);
        break;
      }
      case 'items': {
        // console.log(state.items);
        renderFeed(state);
        // console.log(state.items);
        // console.log(previousValue);
        // console.log(value);
        // watchedState.items = [...previousValue, ...value];
        break;
      }
      default: {
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
