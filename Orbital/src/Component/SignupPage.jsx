import './SignupPage.css'

const SignupPage = () => {
    return (
      <div className="signup-container">
        <h2>Welcome to the Sign Up Page!</h2>
        <div className="form-container">
          <div className="input-field">
            <label htmlFor="name"></label>
            <input type="text" id="name" placeholder="Enter your full name / business" />
          </div>
          <div className="input-field">
            <label htmlFor="email"></label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="input-field">
            <label htmlFor="password"></label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <div className="buttons">
            <button className="signup-btn">Sign Up</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignupPage;