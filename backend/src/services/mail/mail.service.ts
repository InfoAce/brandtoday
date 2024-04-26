import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderEntity, UserEntity } from 'src/entities';
import { sum } from 'lodash';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendUserConfirmation(user: UserEntity) {
    let url = `${this.configService.get('APP_FRONTEND_URL')}/home/verify/email/${user.token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Welcome to  ${this.configService.get<string>('APP_NAME') } Confirm your Email`,
      template: 'welcome', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        app:  this.configService.get<string>('APP_NAME'),
        name: `${user.first_name} ${user.last_name}`,
        url,
        contact: this.configService.get<string>('MAIL_FROM')
      },
    });
  }
  async sendStaffConfirmation(user: UserEntity) {
    let url = `${this.configService.get('APP_FRONTEND_URL')}/dashboard/verify/${user.token}`;

    return await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Welcome to  ${this.configService.get<string>('APP_NAME') } Confirm your Email`,
      template: 'welcome', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        app:  this.configService.get<string>('APP_NAME'),
        name: `${user.first_name} ${user.last_name}`,
        url,
        contact: this.configService.get<string>('MAIL_FROM')
      },
    });
  }

  async sendOrderInvoice(order: OrderEntity,user: UserEntity) {
    let total = sum(order.items.map( item => item.price * item.quantity)).toFixed();
    let url   = this.configService.get<string>('APP_URL');
    return await this.mailerService.sendMail({
      to:      user.email,
      // from:    `Billing Team <billing@brandtoday.co.ke>`, // override default from
      subject: `Order #${order.num_id} created.`,
      template: 'invoice', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        order,
        url,
        user,
        total,
      },
    });
  }

  async sendOrderReceipt(order: OrderEntity,user: UserEntity) {
    let total = sum(order.items.map( item => item.price * item.quantity)).toFixed();
    let url   = this.configService.get<string>('APP_URL');
    return await this.mailerService.sendMail({
      to:       user.email,
      from:    `Billing Team <billing@brandtoday.co.ke>`, // override default from
      subject: `Order #${order.num_id} created.`,
      template: 'receipt', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        order,
        user,
        url,
        total,
      },
    });
  }
}