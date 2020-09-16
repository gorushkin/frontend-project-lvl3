import _ from 'lodash';
import parseFeeds from './parseFeeds';

const comparator = (newPost, oldPost) => newPost.link === oldPost.link;

export default (oldPosts, data, id) => {
  const { posts } = parseFeeds(data);
  const newPosts = _.differenceWith(posts, oldPosts, comparator);
  const postsWithId = newPosts.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));
  return postsWithId;
};
