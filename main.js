class Shelf {
  //   #bookLinkHrefs = [];
  #books = null;
  #genresToBooks = new Map();
  #bookSelector = '#booksBody > tr.bookalike';

  //   getBookLinkHrefs() {
  //     return this.#bookLinkHrefs;
  //   }

  //   setBookLinkHrefs() {
  //     const bookLinks = document.querySelectorAll(
  //       '#booksBody > tr > td.field.title > div.value > a'
  //     );
  //     for (const link of bookLinks) {
  //       this.#bookLinkHrefs.push(link.href);
  //     }
  //   }

  getBooks() {
    return this.#books;
  }

  setBooks() {
    this.#books = document.querySelectorAll(this.#bookSelector);
  }

  getGenresToBooks() {
    return this.#genresToBooks;
  }

  async setGenresToBooks() {
    // const parser = new DOMParser();
    // for (const href of bookLinkHrefs) {
    for (const i = 0; i < this.#books.length; i++) {
      const href = this.#books[i].querySelector(
        'td.field.title > div.value > a'
      ).href;
      //   const response = await fetch(href, { method: 'GET' });
      //   let html;
      //   for await (const chunk of response.body) {
      //     const decodedChunk = decoder.decode(chunk);
      //     if (decodedChunk.includes('div data-testid="genresList"')) {
      //       html = parser.parseFromString(decodedChunk, 'text/html');
      //     }
      //     if (html !== undefined && html !== null) {
      //       const genresOfThisBook = html.querySelectorAll('div[data-testid="genresList"]');
      //       for () {
      //         this.#genresToBooks.set();
      //       }
      //     }
      //   }

      const iframe = document.createElement('iframe');
      document.body.insertBefore(
        iframe,
        document.getElementById('bodycontainer')
      );

      //   iframe.style.position = 'absolute';

      iframe.style.width = 0;
      iframe.style.height = 0;
      //   iframe.style.top = 0;
      //   iframe.style.left = 0;
      //   iframe.style.width = '1000px';
      //   iframe.style.height = '1000px';
      //   iframe.style.zIndex = 10;

      iframe.style.border = 0;
      iframe.src = href;

      // iframeEl.style.position = 'absolute';
      // iframeEl.style.width = 0;
      // iframeEl.style.height = 0;
      // iframeEl.style.border = 0;

      //   iframeEl.style.position = 'absolute';
      //   iframeEl.style.top = 0;
      //   iframeEl.style.left = 0;
      //   iframeEl.style.width = '1000px';
      //   iframeEl.style.height = '1000px';
      //   iframeEl.style.zIndex = 10;
      //   //   iframeEl.style.border = 0;
      //   iframeEl.src = href;

      //   console.log(`iframeEl.src = ${iframeEl.src}`);

      //   console.log(`iframe = ${iframe}`);
      //   console.log(`iframe.contentWindow = ${iframe.contentWindow}`);

      setTimeout(() => {
        console.log(`attempting post, now that 5 seconds have passed`);
        //     iframeWindow.postMessage(
        //       /*{
        //         type: 'triggerEvent',
        //         eventName: 'clickToShowMoreGenres',
        //       }*/ 'hello there!',
        //       'https://www.goodreads.com'
        //     ); // TODO: Use postMessage to indirectly trigger event on page with different origin
        //     //   console.log(`iframeWindow = ${iframeWindow}`);
        //   }, 5000);
        iframe.contentWindow.postMessage(
          {
            /*book: book,*/
            bookIndex: i,
            iframeModification: 'clickToShowMoreGenres',
          } /*'hello there!',
          'https://www.goodreads.com'*/
        );
        //   console.log(`iframeWindow = ${iframeWindow}`);
      }, 5000);

      break;
      //   iframeEl.remove();
      iframe.remove();

      //   let bookPage = iframe.contentWindow;
      //   const waitToHandleBookPage = () => {
      //     if (bookPage === null) {
      //       console.log(`bookPage still null...`);
      //       setTimeout(() => {
      //         bookPage = iframe.contentWindow;
      //         waitToHandleBookPage();
      //       }, 100);
      //     } else {
      //       console.log(`bookPage no longer null!`);
      //       const genresOfThisBook = bookPage.document.querySelectorAll(
      //         'div[data-testid="genresList"]'
      //       );
      //       for (const genre of genresOfThisBook) {
      //         console.log(genre);
      //       }

      //       iframe.remove();
      //     }
      //   };
      //   waitToHandleBookPage();
    }
  }

  setGenresForBook(genres, bookIndex) {
    for (const genre of genres) {
      this.#genresToBooks.set(genre, this.#books[bookIndex]);
      console.log(
        `this.#genresToBooks.get(${genre}).querySelector('td.field.title > div.value > a').textContent = ${
          this.#genresToBooks
            .get(genre)
            .querySelector('td.field.title > div.value > a').textContent
        }`
      );
    }
  }
}

// window.addEventListener('message', (event) => {
//   if (
//     event.data !== null &&
//     'genres' in event.data &&
//     'bookIndex' in event.data
//   ) {
//     setGenresForBook(event.data.genres, event.data.bookIndex);
//   }
// });

const startUp = () => {
  const shelf = new Shelf();

  window.addEventListener('message', (event) => {
    if (
      event.data !== null &&
      'genres' in event.data &&
      'bookIndex' in event.data
    ) {
      shelf.setGenresForBook(event.data.genres, event.data.bookIndex);
    }
  });

  const waitToGetGenres = () => {
    if (shelf.getBooks() === null) {
      setTimeout(() => {
        shelf.setBooks();
        waitToGetGenres();
      }, 100);
    } else {
      shelf.setGenresToBooks();
    }
  };
  waitToGetGenres();
};

window.onload = startUp;
