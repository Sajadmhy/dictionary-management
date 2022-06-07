import { useState } from 'react';
import './App.css';
import SearchPanel from './components/SearchPanel';

export default function App() {
  const [query, setQuery] = useState('');
  
  return (
    <div className="App">
      <SearchPanel query={query} setQuery={setQuery} />
    </div>
  );
}


