class Shelf {
  #books = null;
  #genresToBooks = new Map();
  #bookSelector = '#booksBody > tr.bookalike';

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
    for (const i = 0; i < this.#books.length; i++) {
      const href = this.#books[i].querySelector(
        'td.field.title > div.value > a'
      ).href;

      const iframe = document.createElement('iframe');
      document.body.insertBefore(
        iframe,
        document.getElementById('bodycontainer')
      );

      iframe.style.width = 0;
      iframe.style.height = 0;
      iframe.style.border = 0;
      iframe.src = href;

      setTimeout(() => {
        console.log(`attempting post, now that 5 seconds have passed`);
        iframe.contentWindow.postMessage({
          bookIndex: i,
          iframeModification: 'clickToShowMoreGenres',
        });
      }, 5000);

      break;
      iframe.remove();
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
