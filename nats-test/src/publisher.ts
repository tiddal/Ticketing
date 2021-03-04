import { connect } from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const client = connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

client.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(client);
  await publisher.publish({
    id: '123',
    title: 'show',
    price: 20
  });

});
