import Router from 'next/router';
import { FormEvent, useState } from 'react';
import { ITicket } from '../../entities/ITicket';
import { useRequest } from '../../hooks/use-request';

const NewTicket = (): JSX.Element => {

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: (ticket: ITicket) => Router.push(`/tickets/${ticket.id}`)
  });

  const sanitizePrice = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2).toString());
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            className="form-control"
            value={price}
            onChange={({ target }) => setPrice(target.value)}
            onBlur={sanitizePrice}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
