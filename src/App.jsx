import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import MyReviews from './pages/MyReviews';

export default function App() {
  return (
    <BrowserRouter basename="/movie-app">
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/movie/:id"  element={<MovieDetail />} />
        <Route path="/reviews"    element={<MyReviews />} />
      </Routes>
    </BrowserRouter>
  );
}