import _ from 'lodash';
import parseData from './parseData';

export default (data, url) => {
  const { feed, items } = parseData(data);
  const id = _.uniqueId();
  const itemsWithId = items.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
  return [{ ...feed, id, url }, itemsWithId];
};
