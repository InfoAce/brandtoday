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
   * @param {OrderCreatedEvent} event - The event object
   *
   * @returns {void}
   */
  async handleOrderCreatedEvent({ id }: OrderCreatedEvent) {
    try {
      let order  = await this.orderModel.findOneBy({ id });
      await this.orderTimelineModel.save({ order_id: order.id, name: 'created' })
      await this.mailService.createOrder(order);
    } catch(error) {
      console.log(error);
    }
  }

}