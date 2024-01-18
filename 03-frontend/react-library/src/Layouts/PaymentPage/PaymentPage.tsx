import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInfoRequest from "../../Models/PaymentInfoRequest";

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
                        // Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const responsePayment = await fetch(userFeesUrl, requestOptions);

                if (!responsePayment.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJsonPayment = await responsePayment.json();
                setFees(responseJsonPayment.amount);
            
            setIsLoadingFees(false);
            }
        }
        fetchFees().catch((error: any) => {
            setIsLoadingFees(false);
            setHttpError(error.message);
        })

    }, [authState]);

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        // if no stripe processing
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        // submit button is disabled to prevent multiple submissions
        setSubmitDisabled(true);

        let paymentInfo = new PaymentInfoRequest(Math.round(fees * 100), 'MYR', authState?.accessToken?.claims.sub);

        const url = `https://localhost:8443/api/payment/secure/payment-intent`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentInfo)
        };
        const stripeResponse = await fetch(url, requestOptions);
        if (!stripeResponse.ok) {
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error('Something went wrong!');
        }
        const stripeResponseJson = await stripeResponse.json();

        // if POST request successful, stripe confirm the payment 
        stripe.confirmCardPayment(
            stripeResponseJson.client_secret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
                billing_details: {
                    email: authState?.accessToken?.claims.sub
                }
            }
        }, { handleActions: false }
            // and stripe handle the payment confirmation
        ).then(async function (result: any) {
            if (result.error) {
                setSubmitDisabled(false)
                alert('There was an error')
            } else {
                const url = `https://localhost:8443/api/payment/secure/payment-complete`;
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const stripeResponse = await fetch(url, requestOptions);
                if (!stripeResponse.ok) {
                    setHttpError(true)
                    setSubmitDisabled(false)
                    throw new Error('Something went wrong!')
                }
                // if payment confirmation success, reset fees + enable submit button
                setFees(0);
                setSubmitDisabled(false);
            }
        });
        setHttpError(false);
    }


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

    return (
        <div className='container'>
            {/* if user has outstanding fee */}
            {fees > 0 && <div className='card mt-3'>
                <h5 className='card-header'>Fees pending: <span className='text-danger'>${fees}</span></h5>
                <div className='card-body'>
                    <h5 className='card-title mb-3'>Credit Card</h5>
                    <CardElement id='card-element' />
                    <button disabled={submitDisabled} type='button' className='btn btn-md main-color text-white mt-3'
                        onClick={checkout}>
                        Pay fees
                    </button>
                </div>
            </div>}
            {/* if user does not have outstanding fee */}
            {fees === 0 &&
                <div className='mt-3'>
                    <h5>You have no fees!</h5>
                    <Link type='button' className='btn main-color text-white' to='search'>
                        Explore top books
                    </Link>
                </div>
            }
            {submitDisabled && <SpinnerLoading />}
        </div>
    )

}