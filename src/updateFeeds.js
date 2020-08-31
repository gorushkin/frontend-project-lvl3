import _ from 'lodash';
import getData from './getData';
import parseData from './parseData';

// export default (watchedState) => {
//   const { feeds } = watchedState;
//   watchedState.feeds.forEach((feed) => {
//     onChange.target(watchedState).form.value = feed.url;
//     getData(feed.url).then((data) => {
//       watchedState.form.data = data;
//     });
//   });
// };
