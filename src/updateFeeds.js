import _ from 'lodash';
import getData from './getData';
import parseData from './parseData';

export default (feeds) => {
  console.log(feeds);
  const dataList = feeds.map((feed) => {
    const { url } = feed;
  });
};
