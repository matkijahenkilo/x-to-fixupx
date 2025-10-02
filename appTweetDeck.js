let checkInterval;

// console.log('appTweetDeck.js loaded');

// Function to convert URLs
const convertUrl = (url) => {
  let newUrl;

  if (url.includes('fixupx.com')) {
    // console.log('fixupx link detected.');
  } else if (url.includes('//twitter.com')) {
    // console.log('Twitter link detected.');
    let index = url.indexOf('twitter');
    newUrl = ''.concat(url.slice(0, index) + 'vx' + url.slice(index));
  } else if (url.includes('//x.com')) {
    // console.log('X link detected.');
    let index = url.indexOf('x.com');
    newUrl = ''.concat(
      url.slice(0, index) + 'fixupx' + url.slice(index + 1)
    );
  } else {
    // console.log('Link not detected.');
  }

  if (newUrl) {
    navigator.clipboard.writeText(newUrl).then(
      () => {
        // console.log('Clipboard write success');
      },
      () => {
        // console.log('Clipboard write failed');
      }
    );
  }
};

// Function to convert URLs to spoiler. Here "url" is already passed with || at the ends.
const convertUrlSpoiler = (url) => {
  let newUrl;

  if (url.includes('fixupx.com')) {
    newUrl = url;
  } else if (url.includes('//twitter.com')) {
    // console.log('Twitter link detected.');
    let index = url.indexOf('twitter');
    newUrl = ''.concat(url.slice(0, index) + 'vx' + url.slice(index));
  } else if (url.includes('//x.com')) {
    // console.log('X link detected.');
    let index = url.indexOf('x.com');
    newUrl = ''.concat(
      url.slice(0, index) + 'fixupx' + url.slice(index + 1)
    );
  } else {
    // console.log('Link not detected.');
  }

  if (newUrl) {
    navigator.clipboard.writeText(newUrl).then(
      () => {
        // console.log('Clipboard write success');
      },
      () => {
        // console.log('Clipboard write failed');
      }
    );
  }
};

// Function to check if the URL contains the word "status"
const isTwitterPost = (url) => {
  return (
    (url.includes('twitter.com') || url.includes('x.com')) &&
    url.includes('status')
  );
};

// Event listener for keydown
document.addEventListener('keydown', (event) => {
  // Ctrl + C Functionality
  if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
    const currentUrl = window.location.href;

    //Copy the current url if a post is opened
    if (isTwitterPost(currentUrl)) {
      convertUrl(currentUrl);
    } else {
      navigator.clipboard.readText().then((clipText) => {
        convertUrl(clipText);
      });
    }
  }

  // Ctrl + Q Functionality
  if ((event.ctrlKey || event.metaKey) && event.key === 'q') {
    const currentUrl = window.location.href;

    //Copy the current url if a post is opened
    if (isTwitterPost(currentUrl)) {
      // Append "||" to the beginning and end of the new URL
      let newUrl = '||' + currentUrl + '||';
      convertUrlSpoiler(newUrl);
    } else {
      navigator.clipboard.readText().then((clipText) => {
        // Append "||" to the beginning and end of the new URL
        let newUrl = '||' + clipText + '||';
        convertUrlSpoiler(newUrl);
      });
    }
  }
});

// Function to be called when the text is found
const handleTextFound = () => {
  navigator.clipboard.readText().then((clipText) => {
    convertUrl(clipText);
  });

  clearInterval(checkInterval);
};

// Options for the Mutation Observer
const mutationObserverOptions = { childList: true, subtree: true };

// Function to check for "Copied to clipboard" alert
const checkForText = () => {
  const textElement = document.evaluate(
    '//*[self::p or self::div]//text()[contains(., "copied to clipboard.")]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (textElement) {
    // console.log(textElement);
    handleTextFound();
  }
};

// Set up a Mutation Observer to continuously observe changes in the DOM
// This is better functionality for tweetdeck instead of detecting clicks first.
const observer = new MutationObserver(() => {
  // Restart checking when the DOM changes
  checkForText();
});

// Start observing the entire document for changes
observer.observe(document, mutationObserverOptions);
