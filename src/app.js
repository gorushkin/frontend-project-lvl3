import onChange from 'on-change';
import axios from 'axios';
import validator from './validator';
import parseData from './parseData';

const getData = (feedUrl) => {
  const getUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;
  const data = axios.get(getUrl(feedUrl));
  return data;
};

const addFeed = (url, watchedState) => {
  console.log('feedUrl', url);
  getData(url).then((response) => {
    const { data } = response;
    const { status } = response;
    console.log('status: ', status);
    const feed = parseData(data);
    watchedState.feeds.push(feed);
  });
};

const app = () => {
  console.log('app start');
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');

  const state = {
    value: '',
    list: [],
    isValid: undefined,
    feeds: [],
  };

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'value': {
        validator(state).then((result) => {
          if (result) {
            watchedState.isValid = true;
          } else {
            watchedState.isValid = false;
          }
        });
        break;
      }
      case 'isValid': {
        if (state.isValid) {
          watchedState.list.push(state.value);
          watchedState.isValid = undefined;
          form.reset();
          addFeed(state.value, watchedState);
          onChange.target(watchedState).value = '';
          input.classList.remove('invalid');
        } else {
          input.classList.add('invalid');
        }
        break;
      }
      case 'list': {
        break;
      }
      case 'feeds': {
        console.log(state.feeds);
        break;
      }
      default: {
        console.log('error');
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.value = formData.get('url');
  });
};

export default app;
