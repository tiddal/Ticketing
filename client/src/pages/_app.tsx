import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client';
import { Header } from '../components/Header';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <Header {...pageProps} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async ({ ctx: context }) => {
  const client = buildClient(context);
  const { data: { currentUser } } = await client.get('api/users/current-user');
  return { pageProps: { currentUser } };
};

export default AppComponent;
