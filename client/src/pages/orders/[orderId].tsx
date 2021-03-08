import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../api';
import { IOrder } from '../../entities/IOrder';

interface OrderProps {
  order: IOrder;
}

const Order = ({ order }: OrderProps) => {

  const [timeLeft, setTimeLeft] = useState(Math.round((new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000));

  useEffect(() => {
    const computeTimeLeft = () => {
      const secondsLeft = (new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000;
      setTimeLeft(Math.round(secondsLeft));
    };
    const timer = setInterval(computeTimeLeft, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (timeLeft < 0) return <div>Order Expired</div>;


  return (
    <div>
      <h1>Your Order</h1>
      <p>Expires in {timeLeft} seconds</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderId } = context.query;
  const { data: order } = await api(context).get(`/api/orders/${orderId}`);

  return {
    props: {
      order
    }
  };
};

export default Order;
