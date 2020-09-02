import * as yup from 'yup';
import _ from 'lodash';

export default (url, feeds) => {
  const urlList = feeds.map((feed) => feed.url);
  const schema = yup.string().url('is not valid').notOneOf(urlList, 'exist');
  return schema
    .validate(url)
    .then((result) => result)
    .catch((error) => error.message);
};
