import * as yup from 'yup';
import _ from 'lodash';

const checkIfUrlExistInFeedsList = (feeds, url) => _.findIndex(feeds, { url }) !== -1;

export default (watchedState) => {
  const { feeds, form } = watchedState;
  const { value: url } = form;
  console.log('url: ', url);
  const schema = yup.string().url();
  const isUrlExistInFeedsList = checkIfUrlExistInFeedsList(feeds, url);
  return schema.isValid(url).then((result) => {
    if (isUrlExistInFeedsList) return 2;
    if (result) return null;
    return 4;
  });
};
