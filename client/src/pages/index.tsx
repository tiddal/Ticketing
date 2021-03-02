const Home = ({ currentUser }): JSX.Element => {
  return (
    currentUser
      ? <h1>You are signed in</h1>
      : <h1>You are not signed in</h1>
  );
};

export default Home;
