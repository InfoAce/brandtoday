import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/events';
import { OrderModel, OrderTimelineModel } from 'src/models';
import { MailService } from 'src/services';

@Injectable()
export class OrderCreatedListener {

  /**
   * Constructor
   *
   * @param {MailService} mailService
   */
  constructor(
    private mailService: MailService,
    private readonly orderModel: OrderModel,
    private readonly orderTimelineModel: OrderTimelineModel
  ) {}

  @OnEvent('order.created',{ async: true })
  /**
   * Handles the "OrderCreatedEvent" event
   *
   * This method is triggered when a new order is created. It updates the order's timeline
   * and sends a confirmation email to the user.
   *
   * @param {OrderCreatedEvent} event - The event object containing the order ID
   *
   * @returns {Promise<void>} A promise that resolves when the event handling is complete
   */
  async handleOrderCreatedEvent({ id }: OrderCreatedEvent): Promise<void> {
    try {
      // Fetch the order with the specified ID
      let order = await this.orderModel.findOneBy({ id });

      // Update the order's timeline with a "created" entry
      await this.orderTimelineModel.save({ order_id: order.id, name: 'created', description:'Order has been created' });

      // Send a confirmation email to the user
      await this.mailService.createOrder(order);
    } catch (error) {
      // Log any errors that occur during the event handling
      console.log(error);
    }
  }

}