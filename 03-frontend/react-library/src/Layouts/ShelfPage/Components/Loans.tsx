import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import ShelfCurrentLoans from "../../../Models/ShelfCurrentLoans"
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const Loans = () => {
    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(null);

    // Current Loans
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            const fetchUserCurrentLoans = async () => {
                if (authState && authState.isAuthenticated) {
                    const userCurrentLoansUrl = `http://localhost:8080/api/books/secure/currentloans`;

                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };

                    const responseShelfCurrentLoans = await fetch(userCurrentLoansUrl, requestOptions);

                    if (!responseShelfCurrentLoans.ok) {
                        throw new Error('Something went wrong!');
                    }

                    const responseJsonShelfCurrentLoans = await responseShelfCurrentLoans.json();
                    setShelfCurrentLoans(responseJsonShelfCurrentLoans);

                };
                setIsLoadingUserLoans(false);

            };

        }
        fetchUserCurrentLoans().catch((error: any) => {
            setIsLoadingUserLoans(false);
            setHttpError(error.message);
        })

        window.scrollTo(0, 0);
    }, [authState])

    if (isLoadingUserLoans) {
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

    return (
        <div></div>
    );
}