import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderPaidEvent } from 'src/events';
import { OrderModel, OrderTimelineModel } from 'src/models';
import { MailService } from 'src/services';

@Injectable()
export class OrderPaidListener {

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

  @OnEvent('order.paid',{ async: true })
  /**
   * Handles the "OrderPaidEvent" event
   *
   * When an order is paid, this method is called and it updates the order's status to "paid" and sends an email to the user with the order details
   *
   * @param {OrderPaidEvent} event - The event object
   *
   * @returns {void}
   */
  async handleOrderPaidEvent({ id }: OrderPaidEvent) {
    try {
      // Fetch the order with the specified ID
      let order = await this.orderModel.findOneBy({ id });

      // Update the order's status to "paid"
      await this.orderTimelineModel.save({ order_id: order.id, name: 'paid', description: 'Order has been paid.' });

      // Send an email to the user with the order details
      await this.mailService.payment(order);
    } catch(error) {
      console.log(error);
    }
  }

}