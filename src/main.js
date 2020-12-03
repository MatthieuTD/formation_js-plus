'use strict';

function createLi(tweet) {
  const li = document.createElement('li');
  li.textContent = tweet.full_text;

  return li;
}

function createOl(twts) {
  let monOl = document.createElement('ol');

  twts.forEach(function (t) {
    const li = createLi(t);

    monOl.append(li);
  });

  return monOl;
}

function createFilterButton(twts, ol) {
  const filterButton = document.createElement('button');
  filterButton.textContent = 'Filtrer';

  let isFr = false;

  filterButton.addEventListener('click', function () {
    isFr = !isFr;

    let displayedTweets = twts;

    if (isFr) {
      displayedTweets = twts.filter(function (tw) {
        return tw.lang === 'fr';
      });
    }

    const newOl = createOl(displayedTweets);

    ol.replaceWith(newOl);
    ol = newOl;
  });

  return filterButton;
}

function createTrackingButton() {
  const trackingButton = document.createElement('button');
  trackingButton.textContent = 'Track';
  let isTracking = false;

  function track(e) {
    console.log('X', e.clientX, 'Y', e.clientY);
  }

  trackingButton.addEventListener('click', function () {
    isTracking = !isTracking;

    if (isTracking) {
      window.addEventListener('mousemove', track);
    } else {
      window.removeEventListener('mousemove', track);
    }
  });

  return trackingButton;
}

function getJson(url) {
  return fetch(url)
    .then(function (resp) {
      return resp.json();
    })
    .catch(function (e) {
      console.error(e);
    });
}

const url1 =
  'https://raw.githubusercontent.com/iOiurson/data/master/data/tweets.json';
const url2 =
  'https://raw.githubusercontent.com/iOiurson/data/master/data/tweets2.json';

const p1 = getJson(url1);
const p2 = getJson(url2);

document.addEventListener(
  'DOMContentLoaded',
  function () {
    Promise.all([p1, p2])
      .then(function (tabDeTweets) {
        const tweets = tabDeTweets.flat();
        console.log('Le tableau de tweet', tweets);

        // ### Projet Touitter ###
        const firstOl = createOl(tweets);
        const filterButton = createFilterButton(tweets, firstOl);
        const trackingButton = createTrackingButton();

        document.body.append(filterButton);
        document.body.append(trackingButton);
        document.body.append(firstOl);
      })
      .catch(function (e) {
        console.error(e);
      });
  },
  { once: true },
);
