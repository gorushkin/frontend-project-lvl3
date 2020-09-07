import * as yup from 'yup';

export default (url, feeds) => {
  const urlList = feeds.map((feed) => feed.url);
  const schema = yup.string().url('invalid').notOneOf(urlList, 'exist');
  return schema.validate(url);
};
