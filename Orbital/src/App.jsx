import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loginsignup from './Component/Loginsignup'
import SignupPage from './Component/SignupPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route to main login/signup landing page */}
        <Route path="/" element={<Loginsignup />} />

        {/* Route to a separate sign-up page */}
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}
/*function App() {

  return(
  <div>
    <Loginsignup/>
  </div>
  );
}*/
export default App
