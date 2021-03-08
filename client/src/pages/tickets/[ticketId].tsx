import { GetServerSideProps } from 'next';
import { api } from '../../api';
import { IOrder } from '../../entities/IOrder';
import { ITicket } from '../../entities/ITicket';
import { useRequest } from '../../hooks/use-request';

interface TicketProps {
  ticket: ITicket;
}

const Ticket = ({ ticket }: TicketProps): JSX.Element => {

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order: IOrder) => console.log(order)
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>${ticket.price.toFixed(2)}</h4>
      {errors}
      <button className="btn btn-primary" onClick={doRequest}>Purchase</button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { ticketId } = context.query;
  const { data: ticket } = await api(context).get(`/api/tickets/${ticketId}`);

  return {
    props: {
      ticket
    }
  };
};

export default Ticket;
