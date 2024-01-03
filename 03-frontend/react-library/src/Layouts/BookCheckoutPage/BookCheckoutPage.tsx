import { useState } from "react";
import BookModel from "../../Models/BookModels";
import { useParams } from "react-router-dom";

export const BookCheckoutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    const { bookId }  = useParams<{bookId: string}>();
    // const bookId = (window.location.pathname).split('/')[2];

    
    return (
        <div>
            {bookId}
        </div>
    )
}