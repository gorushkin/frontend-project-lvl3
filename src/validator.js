import * as yup from 'yup';

export default (url) => {
  const schema = yup.string().url();
  const result = schema.isValid(url);
  return result;
};
