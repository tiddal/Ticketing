import axios from 'axios';
import { useState } from 'react';

interface errorAttributes {
  message: string;
  field?: string;
}

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
      onSuccess(response.data);
      return response.data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((error: errorAttributes) => <li key={error.message}>{error.message}</li>)}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export { useRequest };
