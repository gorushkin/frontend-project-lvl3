import _ from 'lodash';
import parseData from './parseData';

const comparator = (newPost, oldPost) => newPost.link === oldPost.link;

export default (oldPosts, data, url, feedId) => {
  const { feed, posts } = parseData(data);
  const id = feedId || _.uniqueId();

  const currentFeed = { ...feed, id, url };

  const newPosts = _.differenceWith(posts, oldPosts, comparator);
  const postsWithId = newPosts.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
  return { currentFeed, postsWithId };
};
