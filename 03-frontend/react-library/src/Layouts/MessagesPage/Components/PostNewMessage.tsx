import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../Models/MessageModels";

export const PostNewMessage = () => {

    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');

    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        const submitQuestionUrl = `${process.env.REACT_APP_API}/messages/secure/add/message`;

        if (authState?.isAuthenticated && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };

            const responseSubmitNewQuestion = await fetch(submitQuestionUrl, requestOptions);
            if (!responseSubmitNewQuestion.ok) {
                throw new Error('Something went wrong!');
            }

            // after successfully sent to backend
            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);


        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className='card mt-3'>
            <div className='card-header'>
                Ask question to GoodReads Admin
            </div>
            <div className='card-body'>
                <form method='POST'>
                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled out
                        </div>
                    }
                    {displaySuccess &&
                        <div className='alert alert-success' role='alert'>
                            Question added successfully
                        </div>
                    }

                    <div className='mb-3'>
                        <label className='form-label'>
                            Title
                        </label>
                        <input className='form-control' type='text' id='exampleFormControlInput1'
                            placeholder='Title' onChange={e => setTitle(e.target.value)} value={title}>
                        </input>
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>
                            Question
                        </label>
                        <textarea className='form-control' id='exampleFormControlTextarea1'
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>
                    <div>
                        <button className='btn btn-primary mt-3' type='button' onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}