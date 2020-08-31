import * as yup from 'yup';
import _ from 'lodash';

const checkIfUrlExistInFeedsList = (feeds, url) => _.findIndex(feeds, { url }) !== -1;

export default (watchedState) => {
  const { feeds, form } = watchedState;
  const { value: url } = form;
  const schema = yup.string().url();
  const isUrlExistInFeedsList = checkIfUrlExistInFeedsList(feeds, url);
  return schema.isValid(url).then((result) => {
    if (isUrlExistInFeedsList) return 'exist';
    if (result) return null;
    return 'invalid';
  });
};
