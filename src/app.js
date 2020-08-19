import onChange from 'on-change';
import validator from './validator';

const app = () => {
  console.log('app start');
  const form = document.querySelector('.rss-form');

  const state = {
    value: '',
    list: [],
    isValid: false,
  };

  const watchedState = onChange(state, (path, value, previousValue, name) => {
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
        if (state.isValid) watchedState.list.push(state.value);
        form.reset();
        watchedState.isValid = false;
        onChange.target(watchedState).value = '';
        console.log(state);
        break;
      }
      case 'list': {
        return true;
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
