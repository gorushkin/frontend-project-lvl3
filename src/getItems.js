import _ from 'lodash';
import parseData from './parseData';

const comparator = (newPost, oldPost) => newPost.guid === oldPost.guid;

export default (watchedState, data, url) => {
  const { feeds, posts: oldPosts } = watchedState;
  const { feed, posts } = parseData(data);
  const feedIndex = _.findIndex(feeds, { url });
  const currentFeed = { ...feeds[feedIndex] };
  const id = currentFeed.id ? currentFeed.id : _.uniqueId();
  const postsWithId = posts.map((item) => ({ ...item, id: _.uniqueId(), feedId: id }));

  const updatedCurrentFeed = {
    ...currentFeed,
    ...feed,
    id,
  };

  const newPosts = _.differenceWith(postsWithId, oldPosts, comparator);
  return { updatedCurrentFeed, newPosts };
};
