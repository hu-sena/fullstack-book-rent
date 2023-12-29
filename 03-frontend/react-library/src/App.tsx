import React from 'react';
import './App.css';
import { Navbar } from './Layouts/NavbarAndFooter/Navbar';
import { ExploreTopBooks } from './Layouts/Homepage/ExploreTopBooks';
import { Carousel } from './Layouts/Homepage/Carousel';
import { Heros } from './Layouts/Homepage/Heros';

function App() {
  return (
    <div>
      <Navbar/>
      <ExploreTopBooks/>
      <Carousel/>
      <Heros/>
    </div>

  );
}

export default App;
