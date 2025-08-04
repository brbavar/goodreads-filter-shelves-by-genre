class Shelf {
  #books = null;
  #testStatuses = [];
  //   #iframes = [];
  //   #bookToIframe = new Map();
  #bookIndexToIframe = new Map();
  #genreToBooks = new Map();
  #bookSelector = '#booksBody > tr.bookalike';

  getBooks() {
    return this.#books;
  }

  setBooks() {
    this.#books = document.querySelectorAll(this.#bookSelector);
  }

  fillTestStatuses() {
    for (let i = 0; i < this.#books.length; i++) {
      this.#testStatuses.push(0);
    }
  }

  //   getTestStatus() {

  //   }

  updateTestStatus(i) {
    this.#testStatuses[i] = 1;
  }

  removeIframe(i) {
    // this.#iframes[i].remove();
    // this.#iframes.splice(i, 1);
    // console.log(
    //   `removing ${this.#books[i]
    //     .querySelector('td.field.title > div.value > a')
    //     .textContent.trim()} iframe`
    // );
    const iframe = this.#bookIndexToIframe.get(i);
    iframe.remove();
    this.#bookIndexToIframe.delete(i);
  }

  //   getBookToIframe() {
  //     return this.#bookToIframe;
  //   }

  getBookIndexToIframe() {
    return this.#bookIndexToIframe;
  }

  getGenreToBooks() {
    return this.#genreToBooks;
  }

  async setGenreToBooks() {
    for (let i = 0; i < this.#books.length; i++) {
      const href = this.#books[i].querySelector(
        'td.field.title > div.value > a'
      ).href;

      //   console.log(`i = ${i}, href = ${href}`);

      const iframe = document.createElement('iframe');
      document.body.insertBefore(
        iframe,
        document.getElementById('bodycontainer')
      );

      iframe.style.width = 0;
      iframe.style.height = 0;
      iframe.style.border = 0;
      iframe.src = href;

      //   this.#iframes.push(iframe);
      //   this.#bookToIframe.set(this.#books[i], iframe);
      this.#bookIndexToIframe.set(i, iframe);

      //   let testPassed = false;
      const waitToPostMessage = () => {
        // if (!testPassed) {
        if (this.#testStatuses[i] === 0) {
          iframe.contentWindow.postMessage({ string: 'testing', bookIndex: i });
          setTimeout(waitToPostMessage, 100);
        } else {
          iframe.contentWindow.postMessage({
            bookIndex: i,
            iframeModification: 'clickToShowMoreGenres',
          });
        }
      };
      waitToPostMessage();
    }

    // setTimeout(() => {
    //   for (const genre of this.#genreToBooks.keys()) {
    //     const books = this.#genreToBooks.get(genre);
    //     console.log(`${genre} books on your shelf:`);
    //     for (const book of books) {
    //       console.log(
    //         book.querySelector('td.field.title > div.value > a').textContent
    //       );
    //     }
    //   }
    // }, 15000);
  }

  setGenresForBook(genres, i) {
    for (const genre of genres) {
      if (this.#genreToBooks.has(genre)) {
        this.#genreToBooks.get(genre).push(this.#books[i]);
      } else {
        this.#genreToBooks.set(genre, [this.#books[i]]);
      }

      //   const books = this.#genreToBooks.get(genre);
      //   console.log(`${genre} books on your shelf:`);
      //   for (const book of books) {
      //     console.log(
      //       book.querySelector('td.field.title > div.value > a').textContent
      //     );
      //   }
    }
  }
}

const startUp = () => {
  const shelf = new Shelf();

  window.addEventListener('message', (event) => {
    if (event.data !== null) {
      const i = event.data.bookIndex;

      if ('string' in event.data && event.data.string === 'test passed') {
        shelf.updateTestStatus(i);
      }

      if ('genres' in event.data && 'bookIndex' in event.data) {
        shelf.setGenresForBook(event.data.genres, i);
        shelf.removeIframe(i);
      }
    }
  });

  const waitToGetGenres = () => {
    if (shelf.getBooks() === null) {
      setTimeout(() => {
        shelf.setBooks();
        waitToGetGenres();
      }, 100);
    } else {
      shelf.fillTestStatuses();
      shelf.setGenreToBooks();
    }
  };
  waitToGetGenres();
};

window.onload = startUp;
