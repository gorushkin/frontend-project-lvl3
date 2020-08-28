import axios from 'axios';
import _ from 'lodash';
import parseData from './parseData';

const getData = (feedUrl) => {
  const getUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;
  const data = axios.get(getUrl(feedUrl));
  return data;
};

export default (watchedState) => {
  const { value: url } = watchedState.form;
  return getData(url).then((response) => {
    const { data } = response;
    const { feed, items } = parseData(data);
    const id = _.uniqueId();
    const itemsWithId = items.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
    return [{ ...feed, id, url }, itemsWithId];
  });
};
