const sendGenresToParentPage = (genresList, eventData) => {
  const genreSpans = genresList.querySelectorAll(
    'span > span.BookPageMetadataSection__genreButton > a.Button > span.Button__labelItem'
  );
  const genres = [];
  for (const span of genreSpans) {
    // if (eventData.bookIndex === 1) {
    //   console.log(
    //     `Course in General Linguistics falls under the genre ${span.textContent}`
    //   );
    // }

    // console.log(
    //   `Book ${eventData.bookIndex} falls under the genre ${span.textContent}`
    // );
    genres.push(span.textContent);
  }
  window.parent.postMessage({
    genres: genres,
    bookIndex: eventData.bookIndex,
  });
};

window.addEventListener('message', (event) => {
  //   console.log(
  //     `event.data.bookIndex = ${event.data.bookIndex}, event.origin = ${event.origin}`
  //   );
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
      // console.log(`event.data.bookIndex = ${event.data.bookIndex}`);

      const genresList = document.querySelector(
        'div[data-testid="genresList"] > ul[aria-label="Top genres for this book"].CollapsableList'
      );
      const moreGenresButton = genresList.querySelector(
        'div.Button__container > button[aria-label="Show all items in the list"]'
      );
      //   console.log(
      //     `On book ${event.data.bookIndex}'s page: moreGenresButton = ${moreGenresButton}`
      //   );
      if (moreGenresButton !== null) {
        moreGenresButton.click();

        const hiddenGenresSublist = genresList.children[1];
        const waitToGetGenres = () => {
          if (hiddenGenresSublist.children.length === 0) {
            setTimeout(waitToGetGenres, 100);
          } else {
            //   if (event.data.bookIndex === 1) {
            //     console.log(
            //       `sending genres of Course in General Linguistics to parent`
            //     );
            //   }

            // console.log(
            //   `waited; now sending genres of book ${event.data.bookIndex} to parent`
            // );
            sendGenresToParentPage(genresList, event.data);
          }
        };
        waitToGetGenres();
      } else {
        // console.log(
        //   `no wait; sending genres of book ${event.data.bookIndex} to parent`
        // );
        sendGenresToParentPage(genresList, event.data);
      }
    }
  }
});
