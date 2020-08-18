import onChange from 'on-change';
import validator from './validator';

const app = () => {
  console.log('app start');

  const state = {
    value: '',
    list: [],
    isValid: false,
  };

  const watchedState = onChange(state, (path, value, previousValue, name) => {
    switch (path) {
      case 'value': {
        validator(state.value).then((result) => {
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

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    form.reset();
    watchedState.value = formData.get('url');
  });
};

export default app;
