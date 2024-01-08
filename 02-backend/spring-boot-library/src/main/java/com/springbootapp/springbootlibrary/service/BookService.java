package com.springbootapp.springbootlibrary.service;

import com.springbootapp.springbootlibrary.dao.BookRepository;
import com.springbootapp.springbootlibrary.dao.CheckoutRepository;
import com.springbootapp.springbootlibrary.entity.Book;
import com.springbootapp.springbootlibrary.entity.Checkout;
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

//    dependency injection
    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {

//        bookId can be present absent (null) or present
        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book doesn't exist or already checkout by other user");

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
        Checkout vaildateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (vaildateCheckout != null) {
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
//                  get(): method to access the elements
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

        Checkout vaildateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(!book.isPresent() || vaildateCheckout == null) {
            throw new Exception("Book does not exist or not checked out by user");
        }

//        using get() method: if the value is present
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        bookRepository.save(book.get());
        checkoutRepository.deleteById(vaildateCheckout.getId());

    }
}
