import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { api } from '../api';
import { ITicket } from '../entities/ITicket';

interface HomeProps {
  tickets: ITicket[];
}

const Home = ({ tickets }: HomeProps): JSX.Element => {

  const renderTicketsList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <th>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a>Purchase</a>
        </Link>
      </th>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets for sale</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {renderTicketsList}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: tickets } = await api(context).get('/api/tickets');

  return {
    props: {
      tickets
    }
  };
};

export default Home;
