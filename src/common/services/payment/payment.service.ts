import { Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
@Injectable()
export class PaymentService {
  private stripe!: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  async checkoutSetion({
    success_url = process.env.SUCCESS_URL! as string,
    cancel_url = process.env.CANCEL_URL! as string,
    mode = 'payment',
    discounts = [],
    metadata = {},
    line_items = [],
  }: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: line_items,
      mode: mode,
      success_url: success_url,
      cancel_url: cancel_url,
      discounts: discounts,
      metadata: metadata,
    });
    return session;
  }
}
