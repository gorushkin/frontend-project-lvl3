import _ from 'lodash';

export default (watchedState) => {
  // const state = watchedState;
  // const {}
  const { value } = watchedState.form;
  watchedState.feeds.push({ id: _.uniqueId(), url: value });
};
