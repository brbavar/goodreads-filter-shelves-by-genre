const sendGenresToParentPage = (genresList, eventData) => {
  const genreSpans = genresList.querySelectorAll(
    'span > span.BookPageMetadataSection__genreButton > a.Button > span.Button__labelItem'
  );
  const genres = [];
  for (const span of genreSpans) {
    genres.push(span.textContent);
  }
  window.parent.postMessage({
    genres: genres,
    bookIndex: eventData.bookIndex,
  });
};

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://www.goodreads.com') {
    return;
  }

  if (event.data !== null) {
    if ('string' in event.data && event.data.string === 'testing') {
      window.parent.postMessage({
        string: 'test passed',
        bookIndex: event.data.bookIndex,
      });
    }

    if (event.data.iframeModification === 'clickToShowMoreGenres') {
      const genresList = document.querySelector(
        'div[data-testid="genresList"] > ul[aria-label="Top genres for this book"].CollapsableList'
      );
      const moreGenresButton = genresList.querySelector(
        'div.Button__container > button[aria-label="Show all items in the list"]'
      );

      if (moreGenresButton !== null) {
        moreGenresButton.click();

        const hiddenGenresSublist = genresList.children[1];
        const waitToGetGenres = () => {
          if (hiddenGenresSublist.children.length === 0) {
            setTimeout(waitToGetGenres, 100);
          } else {
            sendGenresToParentPage(genresList, event.data);
          }
        };
        waitToGetGenres();
      } else {
        sendGenresToParentPage(genresList, event.data);
      }
    }
  }
});
