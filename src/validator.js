import * as yup from 'yup';

export default (watchedState, i18next) => {
  const state = watchedState;
  const { list, value: url } = state;
  const schema = yup.string().url();
  schema.isValid(url).then((result) => {
    if (result) {
      const isUrlInList = list.includes(url);
      if (isUrlInList) {
        state.isValid = false;
        state.message = i18next.t('exist');
      } else {
        state.isValid = true;
        state.message = i18next.t('added');
      }
    } else {
      state.isValid = false;
      state.message = i18next.t('invalid');
    }
  });
};
