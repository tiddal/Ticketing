import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { api } from '../../api';
import { IOrder } from '../../entities/IOrder';
import { IUser } from '../../entities/IUser';
import { useRequest } from '../../hooks/use-request';

interface OrderProps {
  currentUser: IUser;
  order: IOrder;
}

const Order = ({ currentUser, order }: OrderProps): JSX.Element => {

  const [timeLeft, setTimeLeft] = useState(Math.round((new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000));
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders')
  });


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
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51ISQikLfOvEyVsVxzwttnaJIeaB9sfcAral5zlPCBUN3btaGsrGykR3ZnN98vO8wSpjjMzd1ce19sn6n1ebZmerJ00cUGAiGh7"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
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
