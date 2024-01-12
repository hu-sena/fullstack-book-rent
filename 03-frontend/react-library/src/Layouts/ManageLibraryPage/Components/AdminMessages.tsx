import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import MessageModel from "../../../Models/MessageModels";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    const [messages, setMessages] = useState<MessageModel[]>([]);

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        const fetchUserMessages = async () => {

            if (authState && authState.isAuthenticated) {
                const userMessagesUrl = `http://localhost:8080/api/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;

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

    }, [authState, currentPage])

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

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
}