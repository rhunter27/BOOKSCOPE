import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { SEARCH_BOOKS, SAVE_BOOK } from '../utils/queries';
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const { loading, data } = useQuery(SEARCH_BOOKS, {
    variables: { searchTerm: searchInput },
    skip: !searchInput,
  });
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleSaveBook = async (bookId: string) => {
    const bookToSave = data.searchBooks.find((book: any) => book.bookId === bookId);
    try {
      await saveBook({
        variables: { bookData: bookToSave },
        update(cache, { data: { saveBook } }) {
          cache.modify({
            fields: {
              me(existingMeData = {}) {
                return { ...existingMeData, savedBooks: saveBook.savedBooks };
              },
            },
          });
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for books"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div>Loading...</div>}

      {data?.searchBooks?.map((book: any) => (
        <div key={book.bookId}>
          <img src={book.image} alt={book.title} />
          <h3>{book.title}</h3>
          <p>{book.authors?.join(', ')}</p>
          <p>{book.description}</p>
          <a href={book.link} target="_blank" rel="noreferrer">View on Google Books</a>
          {Auth.loggedIn() && (
            <button onClick={() => handleSaveBook(book.bookId)}>
              Save Book
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default SearchBooks;