import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import MessageModel from "../../../Models/MessageModels";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../Models/AdminMessageRequest";

export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    const [messages, setMessages] = useState<MessageModel[]>([]);

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // to trigger useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);


    useEffect(() => {
        const fetchUserMessages = async () => {

            if (authState && authState.isAuthenticated) {
                const userMessagesUrl = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const responseMessages = await fetch(userMessagesUrl, requestOptions);

                if (!responseMessages.ok) {
                    throw new Error('Something went wrong!');
                }

                const responseJsonMessage = await responseMessages.json();
                setMessages(responseJsonMessage._embedded.messages);

                setTotalPages(responseJsonMessage.page.totalPages);

            };
            setIsLoadingMessages(false);

        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);

    }, [authState, currentPage, btnSubmit])

    if (isLoadingMessages) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    async function submitResponseToQuestion(id: number, response: string) {
        const submitResponseUrl = `${process.env.REACT_APP_API}/messages/secure/admin/message`;
        if (authState && authState?.isAuthenticated && id !== null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);

            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminRequestModel)
            }

            const messageAdminRequestModelResponse = await fetch(submitResponseUrl, requestOptions);
            if (!messageAdminRequestModelResponse.ok) {
                throw new Error('Something went wrong!');
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion} />
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    )
}