import logo from './logo.svg';
import './App.css';
import Routing from './components/routing';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routing />

      </div>
      <ToastContainer />

    </BrowserRouter>
    
  );
}

export default App;
