import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Reviews from './pages/Reviews';
import Upcoming from './pages/Upcoming';
import Guidelines from './pages/Guidelines';
import Discord from './pages/Discord';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Contact from './pages/Contact';

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games/:slug" element={<GameDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/news" element={<NewsList />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/support" element={<Support />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/discord" element={<Discord />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
