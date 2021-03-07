const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: 'randomStripeId'
    })
  }
};

export { stripe };
