import { useEffect, useState } from "react";
import ReviewModel from "../../../Models/ReviewModels";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const ReviewListPage = () => {

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { bookId } = useParams<{ bookId: string }>();

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJsonReviews = await responseReviews.json();
            const responseDataReviews = responseJsonReviews._embedded.reviews;

            setTotalAmountOfReviews(responseJsonReviews.page.totalElements);
            setTotalPages(responseJsonReviews.page.totalPages);

            const loadedReviews: ReviewModel[] = [];

            for (const key in responseDataReviews) {
                loadedReviews.push({
                    id: responseDataReviews[key].id,
                    userEmail: responseDataReviews[key].userEmail,
                    date: responseDataReviews[key].date,
                    rating: responseDataReviews[key].rating,
                    book_id: responseDataReviews[key].bookId,
                    reviewDescription: responseDataReviews[key].reviewDescription,
                });

                setReviews(loadedReviews);
                setIsLoadingReviews(false);

            };

            fetchBookReviews().catch((error: any) => {
                setIsLoadingReviews(false);
                setHttpError(error.message);
            })

        }
    }, [currentPage]);

    if (isLoadingReviews) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    // index reviews for per page
    const indexOfLastBook: number = currentPage * reviewsPerPage;
    const indexOfFirstBook: number = indexOfLastBook - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ?
        reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div></div>
    )
}