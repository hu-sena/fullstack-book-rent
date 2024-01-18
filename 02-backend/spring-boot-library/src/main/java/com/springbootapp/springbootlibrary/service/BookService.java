package com.springbootapp.springbootlibrary.service;

import com.springbootapp.springbootlibrary.dao.BookRepository;
import com.springbootapp.springbootlibrary.dao.CheckoutRepository;
import com.springbootapp.springbootlibrary.dao.HistoryRepository;
import com.springbootapp.springbootlibrary.dao.PaymentRepository;
import com.springbootapp.springbootlibrary.entity.Book;
import com.springbootapp.springbootlibrary.entity.Checkout;
import com.springbootapp.springbootlibrary.entity.History;
import com.springbootapp.springbootlibrary.entity.Payment;
import com.springbootapp.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private HistoryRepository historyRepository;
    private PaymentRepository paymentRepository;

//    dependency injection
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,
                       HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {

//        bookId can be present absent (null) or present
        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checkout by other user");
        }

//        not allow user to check out if there is outstanding fee
//        if late: outstanding fee + book need to be returned first + pay outstanding fee
        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        boolean bookNeedsReturned = false;

        for (Checkout checkout : currentBooksCheckedOut) {
            Date returnDate = dateFormat.parse(checkout.getReturnDate());
            Date currentDate = dateFormat.parse(LocalDate.now().toString());

            TimeUnit time = TimeUnit.DAYS;

            double differenceInTime = time.convert(returnDate.getTime() - currentDate.getTime(),
                                                    TimeUnit.MILLISECONDS);

            if (differenceInTime < 0) {
                bookNeedsReturned = true;
                break;
            }

        }

//        validate if there is outstanding fee + books need to be returned first
        Payment userPayment = paymentRepository.findByUserEmail(userEmail);
        if ((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && bookNeedsReturned)) {
            throw new Exception("Outstanding Fees");
        }

        if (userPayment == null) {
            Payment payment = new Payment();
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        checkoutRepository.save(checkout);

        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout != null) {
            return true;
        } else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

//        find books checked out by user into a list
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);

//        retrieve book IDs into a list from checkoutList
        List<Long> bookIdList = new ArrayList<>();
        for (Checkout i : checkoutList) {
            bookIdList.add(i.getBookId());
        }

//        retrieve the books information based on book IDs
        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book : books) {
//            stream(): method to perform operations on elements in the list
            Optional<Checkout> checkout = checkoutList.stream()
//                    filter the elements of Checkout object that match book IDs in Book object
//                    - to retrieve information of checked out books from Book list
                    .filter(x -> x.getBookId() == book.getId()).findFirst();

            if (checkout.isPresent()) {
//                  get(): method to access the elements that has value
                Date returnDate = dateFormat.parse(checkout.get().getReturnDate());
                Date currentDate = dateFormat.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long differenceInTime = time.convert(returnDate.getTime() - currentDate.getTime(),
                                                    TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) differenceInTime));

            }
        }

        return shelfCurrentLoansResponses;
    }

    public void returnBook (String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

//        get(): method to access the elements that has value (present)
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        bookRepository.save(book.get());

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date returnDate = dateFormat.parse(validateCheckout.getReturnDate());
        Date currentDate = dateFormat.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;
        double differenceInTime = time.convert(returnDate.getTime() - currentDate.getTime(),
                TimeUnit.MILLISECONDS);

//        impose payment if late
        if (differenceInTime < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);
//            (differenceInTime * - 1): since differenceInTime is negative, (-1) to make it positive
            payment.setAmount(payment.getAmount() + (differenceInTime * - 1));
            paymentRepository.save(payment);
        }

        checkoutRepository.deleteById(validateCheckout.getId());

        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
//                returned date
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()

        );

        historyRepository.save(history);
    }

    public void renewLoan (String userEmail, Long bookId) throws Exception {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(validateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

//        allow only if it is not past the loan period
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date returnDate = dateFormat.parse(validateCheckout.getReturnDate());
        Date currentDate = dateFormat.parse(LocalDate.now().toString());

        if (returnDate.compareTo(currentDate) > 0 || returnDate.compareTo(currentDate) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}
