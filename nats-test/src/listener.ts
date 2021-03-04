import { connect, Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const client = connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

client.on('connect', () => {
  console.log('Listener connected to NATS');

  client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('tickets-service');

  const subscription = client.subscribe('ticket:created', 'queue-group-name', options);

  subscription.on('message', (message: Message) => {
    const data = message.getData() as string;

    console.log(
      `Received event #${message.getSequence()}, with data: ${data}`
    );

    message.ack();

  });

});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());
