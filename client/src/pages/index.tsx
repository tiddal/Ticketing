import { GetServerSideProps } from 'next';
import { buildClient } from '../api/build-client';

interface HomeProps {
  currentUser: {
    id: string;
    email: string;
  };
}

const Home = (props: HomeProps): JSX.Element => {
  return (
    props.currentUser
      ? <h1>You are signed in</h1>
      : <h1>You are not signed in</h1>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context);
  const { data: { currentUser } } = await client.get('api/users/current-user');
  return {
    props: {
      currentUser
    }
  };
};

export default Home;
