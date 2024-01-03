import { useEffect, useState } from "react";
import BookModel from "../../Models/BookModels";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../Models/ReviewModels";

export const BookCheckoutPage = () => {

    // Book State

    const [book, setBook] = useState<BookModel>();
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const { bookId } = useParams<{ bookId: string }>();

    // Book useEffect
    useEffect(() => {
        const fetchBook = async () => {
            const bookUrl: string = `http://localhost:8080/api/books/${bookId}`;

            const responseBook = await fetch(bookUrl);

            if (!responseBook.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonBook = await responseBook.json();

            const loadedBook: BookModel = {
                id: responseJsonBook.id,
                title: responseJsonBook.title,
                author: responseJsonBook.author,
                description: responseJsonBook.description,
                copies: responseJsonBook.copies,
                copiesAvailable: responseJsonBook.copiesAvailable,
                category: responseJsonBook.category,
                img: responseJsonBook.img
            };

            setBook(loadedBook);
            setIsLoadingBook(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoadingBook(false);
            setHttpError(error.message);
        })
    }, []);

    // Review useEffect

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseDataReviews = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseDataReviews) {
                loadedReviews.push({
                    id: responseDataReviews[key].id,
                    userEmail: responseDataReviews[key].userEmail,
                    date: responseDataReviews[key].date,
                    rating: responseDataReviews[key].rating,
                    book_id: responseDataReviews[key].bookId,
                    reviewDescription: responseDataReviews[key].reviewDescription,
                });
                
                // total accumulation from all ratings
                weightedStarReviews = weightedStarReviews + responseDataReviews[key].rating;
            }

            // calculate average stars given to a book based on reviews
            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);

        };

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })

    }, []);

    if (isLoadingBook || isLoadingReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                {/* load error */}
                <p>{httpError}</p>
            </div>
        )
    }


    return (
        <div>
            {/* Desktop */}
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={4} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
            </div>

            {/* Mobile */}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={4} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
            </div>
        </div>
    )
}