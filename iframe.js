window.addEventListener('message', (event) => {
  if (event.origin !== 'https://www.goodreads.com') {
    return;
  }

  if (
    event.data !== null &&
    event.data.iframeModification === 'clickToShowMoreGenres'
  ) {
    const genresList = document.querySelector(
      'div[data-testid="genresList"] > ul[aria-label="Top genres for this book"].CollapsableList'
    );

    const hiddenGenresSublist = genresList.children[1];

    const moreGenresButton = genresList.querySelector(
      'div.Button__container > button[aria-label="Show all items in the list"]'
    );
    moreGenresButton.click();

    const waitToGetGenres = () => {
      if (hiddenGenresSublist.children.length === 0) {
        setTimeout(waitToGetGenres, 100);
      } else {
        const genreSpans = genresList.querySelectorAll(
          'span > span.BookPageMetadataSection__genreButton > a.Button > span.Button__labelItem'
        );
        const genres = [];
        for (const span of genreSpans) {
          genres.push(span.textContent);
        }
        window.parent.postMessage({
          genres: genres,
          bookIndex: event.data.bookIndex,
        });
      }
    };
    waitToGetGenres();
  }
});
