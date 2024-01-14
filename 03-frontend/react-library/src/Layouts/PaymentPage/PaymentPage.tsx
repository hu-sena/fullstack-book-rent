import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const PaymentPage = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [isLoadingFees, setIsLoadingFees] = useState(true);

    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);

    useEffect(() => {
        const fetchFees = async () => {
            if (authState && authState.isAuthenticated) {
                const userFeesUrl = `${process.env.REACT_APP_API}/payments/search/findByUserEmail/?userEmail=${authState.accessToken?.claims.sub}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const responsePayment = await fetch(userFeesUrl, requestOptions);

                if (!responsePayment.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJsonPayment = await responsePayment.json();
                setFees(responseJsonPayment.amount);
            };
            setIsLoadingFees(false);
        }
        fetchFees().catch((error: any) => {
            setIsLoadingFees(false);
            setHttpError(error.message);
        })

    }, [authState]);

    if (isLoadingFees) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }


}