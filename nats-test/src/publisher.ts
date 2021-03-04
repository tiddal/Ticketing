import { connect } from 'node-nats-streaming';

console.clear();

const client = connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

client.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'show',
    price: 20
  });

  client.publish('ticket:created', data, () => {
    console.log('Event published');
  });

});
