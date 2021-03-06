import { TicketUpdatedEvent } from '@tiddal/ticketing-common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = new Ticket({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Test Show',
    price: 10,

  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'Test Comedy Show',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString()
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, message, ticket } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);


});

it('acknowledges the message', async () => {

  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();

});

it('does not acknowledges the messages if the event has a skipped version number', async () => {
  const { listener, data, message } = await setup();

  data.version += 1;

  await expect(listener.onMessage(data, message)).rejects.toThrow();

  expect(message.ack).not.toHaveBeenCalled();
});
