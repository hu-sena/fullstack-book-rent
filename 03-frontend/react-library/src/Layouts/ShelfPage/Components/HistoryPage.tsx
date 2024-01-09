import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const HistoryPage = () => {
    
    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // History
    const [histories, setHistories] = useState<History[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const userHistoryUrl = `http://localhost:8080/api/histories/findBooksByUserEmail/?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        // retrieve for email (authState.accessToken.claims.sub), not passing the token
                        // Authorization: `Bearer ${authState.accessToken?.accessToken}`
                        'Content-Type': 'application/json'
                    }
                };

                const responseHistory = await fetch(userHistoryUrl, requestOptions);

                if (!responseHistory.ok) {
                    throw new Error('Something went wrong!');
                }

                const responseJsonHistory = await responseHistory.json();
                setHistories(responseJsonHistory._embedded.histories);

                setTotalPages(responseJsonHistory.page.totalPages);

            };
            setIsLoadingHistory(false);

        }
        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        })
    }, [authState, currentPage]);

    if (isLoadingHistory) {
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

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
}