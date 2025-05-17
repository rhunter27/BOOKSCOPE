// Add this to your BookCardProps interface
import { Card, Button } from 'react-bootstrap';

interface Book {
    id: string; // Ensure the Book interface includes an id property
    // Add other properties of the Book type as needed
}

interface BookCardProps {
    book: Book;
    onSave?: (bookId: string) => void;
    onRemove?: (bookId: string) => void;
    isSaved?: boolean;
    showSave?: boolean; // Add this line
}
  
  // Then modify the component to use it
 
const BookCard = ({ book, onSave, onRemove, isSaved = false, showSave = true }: BookCardProps) => {
    // Component implementation
  
    return (
      <Card className="h-100 shadow-sm">
        {/* ... other card content ... */}
        <div className="d-flex gap-2 mt-auto">
          {/* ... other buttons ... */}
          {showSave && onSave && !isSaved && (
            <Button 
              variant="success" 
              onClick={() => onSave(book.id)}
            >
              Save Book
            </Button>
          )}
          {/* ... rest of the buttons ... */}
        </div>
      </Card>
    );
  };

export default BookCard;