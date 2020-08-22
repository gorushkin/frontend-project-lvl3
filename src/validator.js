import * as yup from 'yup';

export default ({ value: url, list }, watchedState) => {
  const state = watchedState;
  const schema = yup.string().url();
  schema.isValid(url).then((result) => {
    if (result) {
      const isUrlInList = list.includes(url);
      if (isUrlInList) {
        state.isValid = false;
        state.message = 'Rss already exists';
      } else {
        state.isValid = true;
        state.message = 'Rss added';
      }
    } else {
      state.isValid = false;
      state.message = 'Rss is invalid';
    }
  });
};
