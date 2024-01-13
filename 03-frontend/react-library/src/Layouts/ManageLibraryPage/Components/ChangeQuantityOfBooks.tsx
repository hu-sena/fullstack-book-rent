import { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModels";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchBooks = async () => {
            const fetchBooksUrl = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`;

            const fetchBooksResponse = await fetch(fetchBooksUrl);

            if (!fetchBooksResponse.ok) {
                throw new Error('Something went wrong!');
            }

            const fetchBooksResponseJson = await fetchBooksResponse.json();
            const responseData = fetchBooksResponseJson._embedded.books;

            setTotalAmountOfBooks(fetchBooksResponseJson.page.totalElements);
            setTotalPages(fetchBooksResponseJson.page.totalPages);

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })

    }, [currentPage,]);

    // index books for per page
    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;

    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (isLoading) {
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
}