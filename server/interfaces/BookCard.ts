export interface BookCard {
    book: any; // Replace `any` with the actual type of `book`
    onSave: (bookId: string) => Promise<void>;
    isSaved: boolean;
    showSave: boolean; // Added showSave property
  }