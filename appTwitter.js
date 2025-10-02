// Loops every second to add new tweets loaded.
setInterval(function timer() {
  const tweets = document.querySelectorAll(
    'article[data-testid="tweet"], div[aria-labelledby="modal-header"]'
  );

  // Adds a listener to each tweet's share button.
  tweets.forEach((tweet) => {
    const shareButton = tweet.querySelector('[aria-label="Share post"]');
    if (shareButton && !shareButton.hasAttribute('listener')) {
      shareButton.setAttribute('listener', 'true');
      shareButton.addEventListener('click', handleShare(), true);
    }
  });
}, 1000);

function handleShare() {
  //Once the share button is clicked, adds a listener to the "Copy link" button.
  return function handleClick(event) {
    setTimeout(function hookToMenu() {
      // console.log('Share button clicked.');
      const copyLinkButton = document.querySelector(
        '.r-1q9bdsx > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)'
      );
      if (copyLinkButton) {
        copyLinkButton.addEventListener(
          'click',
          function () {
            setTimeout(async function hookToClipboard() {
              // console.log('Copy link button clicked.');
              navigator.clipboard.readText().then((clipText) => {
                convertUrl(clipText);
              });
            }, 50); //50ms to wait for twitter's copy to clipboard
          },
          false
        );
      }
    }, 50);
  };
}

// Function to convert URLs
const convertUrl = (url) => {
  let newUrl;

  if (url.includes('fixupx.com')) {
    // console.log('fixupx link detected.');
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

// Event listener for keypresses
document.addEventListener('keydown', (event) => {
  // Ctrl + C Functionality
  if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
    const currentUrl = window.location.href;

    //Copy the current url if a post (status) is opened
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

    //Copy the current url if a post (status) is opened
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
