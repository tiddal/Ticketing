import axios from 'axios';
import { FormEvent, useState } from 'react';

const SignUp = (): JSX.Element => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/users/sign-up', { email, password });
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };

  const renderErrors = () => {
    return (
      <div className="alert alert-danger">
        <h4>Oops...</h4>
        <ul className="my-0">
          {errors.map(error => <li key={error.message}>{error.message}</li>)}
        </ul>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      {errors.length > 0 && renderErrors()}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignUp;
