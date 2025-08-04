window.addEventListener('message', (event) => {
  //   console.log(`event.source is ${event.source}`);

  //   console.log(`event.origin is ${event.origin}`);

  //   console.log(`event.data is ${event.data}`);

  //   console.log(`event.data.type is ${event.data.type}`);
  //   console.log(`event.data.eventName is ${event.data.eventName}`);

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
        // for (const span of genreSpans) {
        //   console.log(span.textContent);
        // }
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
