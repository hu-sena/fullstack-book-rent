import { useEffect, useState } from "react";
import BookModel from "../../Models/BookModels";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../Models/ReviewModels";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../Models/ReviewRequestModels";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    // Book State
    const [book, setBook] = useState<BookModel>();
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loan Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Book Checked Out?
    const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    const { bookId } = useParams<{ bookId: string }>();

    // array dependency =  
    // If the user has not left a review, we will show a state where a user can input a review. 
    // If the user has left a review, we show a view state saying "thanks for the review".

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
    }, [isBookCheckedOut]);

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

    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const userReviewUrl = `http://localhost:8080/api/reviews/secure/user/book/?bookId=${bookId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const responseUserReview = await fetch(userReviewUrl, requestOptions);

                if (!responseUserReview.ok) {
                    throw new Error('Something went wrong!');
                }

                const responseJsonUserReview = await responseUserReview.json();
                setIsReviewLeft(responseJsonUserReview);

            }
            setIsLoadingUserReview(false);
        };

        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState])

    // Loan Count useEffect
    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const currentLoansCountUrl = `http://localhost:8080/api/books/secure/currentloans/count`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const responseCurrentLoansCount = await fetch(currentLoansCountUrl, requestOptions);

                if (!responseCurrentLoansCount.ok) {
                    throw new Error('Something went wrong!');
                }

                const responseJsonCurrentLoansCount = await responseCurrentLoansCount.json();
                setCurrentLoansCount(responseJsonCurrentLoansCount);

            }
            setIsLoadingCurrentLoansCount(false);

        };

        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })

        // dependency array - the useEffect runs whenever the authState changes
    }, [authState, isBookCheckedOut])

    // Book Checked Out? useEffect
    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const isBookCheckedOutUrl = `http://localhost:8080/api/books/secure/ischeckedout/user/?bookId=${bookId}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const responseIsBookCheckedOut = await fetch(isBookCheckedOutUrl, requestOptions);

                if (!responseIsBookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }

                const responseJsonIsBookCheckedOut = await responseIsBookCheckedOut.json();
                setIsBookCheckedOut(responseJsonIsBookCheckedOut);

            };
            setIsLoadingBookCheckedOut(false);

        };

        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState])

    if (isLoadingBook || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
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

    async function checkoutBook() {

        const checkoutBookUrl = `http://localhost:8080/api/books/secure/checkout/?bookId=${book?.id}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const responseCheckoutBook = await fetch(checkoutBookUrl, requestOptions);

        if (!responseCheckoutBook.ok) {
            throw new Error('Something went wrong!');
        }

        setIsBookCheckedOut(true);

    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;

        // check if the book is exist
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);

        const submitReviewUrl = `http://localhost:8080/api/reviews/secure`;

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            // convert JavaScript object into JSON-formatted string
            body: JSON.stringify(reviewRequestModel)
        };

        const responseSubmitReview = await fetch(submitReviewUrl, requestOptions);

        if (!responseSubmitReview.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);

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
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated} isCheckedOut={isBookCheckedOut}
                        checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
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
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isBookCheckedOut}
                    checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    )
}