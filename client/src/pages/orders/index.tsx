import { GetServerSideProps } from 'next';
import { api } from '../../api';
import { IOrder } from '../../entities/IOrder';

interface OrdersProps {
  orders: IOrder[];
}

const Orders = ({ orders }: OrdersProps): JSX.Element => {
  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {orders.map((order) => (
          <li>{order.ticket.title} - {order.status}</li>
        ))}
      </ul>
    </div>

  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data: orders } = await api(context).get(`/api/orders`);

  return {
    props: {
      orders
    }
  };
};

export default Orders;
