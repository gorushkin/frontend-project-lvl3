import _ from 'lodash';
import parseFeeds from './parseFeeds';

export default (data, url) => {
  const { feed, posts } = parseFeeds(data);
  const id = _.uniqueId();

  const currentFeed = { ...feed, id, url };

  const postsWithId = posts.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
  return { currentFeed, postsWithId };
};
