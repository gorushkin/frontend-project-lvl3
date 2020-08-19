import onChange from 'on-change';
import validator from './validator';

const app = () => {
  console.log('app start');
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');

  const state = {
    value: '',
    list: [],
    isValid: undefined,
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
        console.log(input);
        if (state.isValid) {
          watchedState.list.push(state.value);
          watchedState.isValid = undefined;
          form.reset();
          onChange.target(watchedState).value = '';
          input.classList.remove('invalid');
          console.log('change input color to none');
        } else {
          console.log('change input color to red');
          input.classList.add('invalid');
        }
        break;
      }
      case 'list': {
        console.log(state);
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
