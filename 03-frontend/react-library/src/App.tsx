import React from 'react';
import './App.css';
import { Navbar } from './Layouts/NavbarAndFooter/Navbar';
import { Footer } from './Layouts/NavbarAndFooter/Footer';
import { HomePage } from './Layouts/HomePage/HomePage';
import { SearchBooksPage } from './Layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch } from 'react-router-dom';

export const App = () => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>
        <Route path='/home'>
          <HomePage />
        </Route>
        <Route path='/search'>
          <SearchBooksPage />
        </Route>
      </Switch>
      <Footer />
    </div>

  );
}

