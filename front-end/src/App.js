import logo from './logo.svg';
import './App.css';
import Routing from './components/routing';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routing />
      </div>
    </BrowserRouter>
  );
}

export default App;
