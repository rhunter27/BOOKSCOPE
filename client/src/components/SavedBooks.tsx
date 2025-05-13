import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, REMOVE_BOOK } from '../utils/queries';
import Auth from '../utils/auth';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};

  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
        update(cache) {
          const { me } = cache.readQuery({ query: GET_ME }) as any;
          cache.writeQuery({
            query: GET_ME,
            data: { me: { ...me, savedBooks: me.savedBooks.filter((book: any) => book.bookId !== bookId) } },
          });
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Saved Books</h2>
      {userData.savedBooks?.map((book: any) => (
        <div key={book.bookId}>
          <img src={book.image} alt={book.title} />
          <h3>{book.title}</h3>
          <p>{book.authors?.join(', ')}</p>
          <p>{book.description}</p>
          <a href={book.link} target="_blank" rel="noreferrer">View on Google Books</a>
          <button onClick={() => handleDeleteBook(book.bookId)}>
            Delete Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedBooks;