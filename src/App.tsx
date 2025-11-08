import { useState, useEffect } from 'react';
import axios from 'axios';

interface Book { _id: string; title: string; author: string; year: number; genre: string; }

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US'));

  useEffect(() => {
    fetchBooks();
    const interval = setInterval(() => setDate(new Date().toLocaleDateString('es-MX')), 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchBooks = async () => {
    const res = await axios.get('https://mylibrary-backend-83lh.onrender.com');
    setBooks(res.data);
  };

  const addBook = async () => {
    await axios.post('https://mylibrary-backend.onrender.com/books', { title, author, year: Number(year), genre });
    setTitle(''); setAuthor(''); setYear(''); setGenre('');
    fetchBooks();
  };

  const filtered = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-indigo-800 mb-2">My Library</h1>
        <p className="text-center text-2xl text-indigo-600 mb-8">{date}</p>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-4">
            {books.length} BOOKS
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Add Book</h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="p-3 border rounded-lg" />
            <input placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="p-3 border rounded-lg" />
            <input placeholder="Year" value={year} onChange={e => setYear(e.target.value)} className="p-3 border rounded-lg" />
            <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} className="p-3 border rounded-lg" />
          </div>
          <button onClick={addBook} className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
            + Add
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <input 
            placeholder="Search by title or author..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full p-4 border rounded-lg mb-6 text-lg"
          />
          <div className="space-y-4">
            {filtered.map(book => (
              <div key={book._id} className="border-l-4 border-indigo-500 pl-4 py-2">
                <p className="font-bold text-lg">{book.title}</p>
                <p className="text-gray-600">{book.author} • {book.year} • {book.genre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;