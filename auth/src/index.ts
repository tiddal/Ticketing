import express, { json } from 'express';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (request, response) => {
  response.send('Hi there');
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
