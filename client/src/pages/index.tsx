import axios from 'axios';
import { GetServerSideProps } from 'next';
import { api } from '../api';

interface TicketAttributes {
  id: string;
  price: number;
  title: string;
  userId: string;
  version: number;
}

interface UserAttributes {
  id: string;
  email: string;
  iat: number;
}

interface HomeProps {
  currentUser: UserAttributes;
  tickets: TicketAttributes[];
}

const Home = ({ currentUser, tickets }: HomeProps): JSX.Element => {
  console.log(currentUser);

  const renderTicketsList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
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
  const { data } = await api(context).get('/api/tickets');

  return {
    props: {
      tickets: data
    }
  };
};

export default Home;
