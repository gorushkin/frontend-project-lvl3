import * as yup from 'yup';

export default ({ value: url, list }) => {
  const schema = yup.string().url();
  const result = schema.isValid(url).then((isUrlValid) => {
    const isUrlInList = list.includes(url);
    return isUrlValid && !isUrlInList;
  });
  return result;
};
