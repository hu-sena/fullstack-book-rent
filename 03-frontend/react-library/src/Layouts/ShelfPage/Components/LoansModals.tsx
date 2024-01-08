import ShelfCurrentLoans from "../../../Models/ShelfCurrentLoans";

export const LoansModal: React.FC<{
    shelfCurrentLoan: ShelfCurrentLoans, mobile: boolean,
}> = (props) => {
    return (
        <div className='modal fade' id={props.mobile ? `mobilemodal${props.shelfCurrentLoan.book.id}` :
            `modal${props.shelfCurrentLoan.book.id}`} data-bs-backdrop='static' data-bs-keyboard='false'
            aria-labelledby='staticBackdropLabel' aria-hidden='true' key={props.shelfCurrentLoan.book.id}>
            {/* dialog box */}
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title' id='staticBackdropLabel'>
                            Loan Options
                        </h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'>
                        </button>
                    </div>
                    <div className='modal-body'>
                        <div className='container'>
                            <div className='mt-3'>
                                <div className='row'>
                                    <div className='col-2'>
                                        {props.shelfCurrentLoan.book?.img ?
                                            <img src={props.shelfCurrentLoan.book?.img}
                                                width='56' height='87' alt='Book' />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                                                width='56' height='87' alt='Book' />
                                        }
                                    </div>
                                    <div className='col-10'>
                                        <h6>{props.shelfCurrentLoan.book.author}</h6>
                                        <h4>{props.shelfCurrentLoan.book.title}</h4>
                                    </div>
                                </div>
                                <hr />
                                {props.shelfCurrentLoan.daysLeft > 0 &&
                                    <p className='text-secondary'>
                                        Due in {props.shelfCurrentLoan.daysLeft} days.
                                    </p>
                                }
                                {props.shelfCurrentLoan.daysLeft === 0 &&
                                    <p className='text-success'>
                                        Due Today.
                                    </p>
                                }
                                {props.shelfCurrentLoan.daysLeft < 0 &&
                                    <p className='text-danger'>
                                        Past due by {props.shelfCurrentLoan.daysLeft} days.
                                    </p>
                                }
                                <div className='list-group mt-3'>
                                    {/* return book button */}
                                    <button className='list-group-item list-group-item-action'
                                        data-bs-dismiss='modal' aria-current='true'>
                                        Return Book
                                    </button>
                                    {/* renew or not button */}
                                    <button className={
                                        props.shelfCurrentLoan.daysLeft < 0 ?
                                            'list-group-item list-group-item-action inactiveLink' :
                                            'list-group-item list-group-item-action'
                                    } data-bs-dismiss='modal'>
                                        {/* button description based on conditions */}
                                        {props.shelfCurrentLoan.daysLeft < 0 ?
                                            'Late dues cannot be renewed' : 'Renew loan for 7 days'
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button className='btn btn-secondary' type='button' data-bs-dismiss='modal'>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}