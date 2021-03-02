import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  );
};

AppComponent.getInitialProps = async ({ ctx: context }) => {
  const client = buildClient(context);
  const { data: { currentUser } } = await client.get('api/users/current-user');
  return { pageProps: { currentUser } };
};

export default AppComponent;
