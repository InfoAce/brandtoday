import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderEntity, UserEntity } from 'src/entities';
import { sum } from 'lodash';
const { sep } = require('path'); 
const fs      = require('fs');

@Injectable()
export class MailService {

  private readonly logger = new Logger(MailService.name);

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  /**
   * Sends a confirmation email to a user.
   * 
   * @param user - The user to send the email to.
   * @returns A Promise that resolves when the email is sent.
   */
  async sendUserConfirmation(user: UserEntity) {

    try{
      
      // Send the email.
      return await this.mailerService.sendMail({
        to: user.email,  // The recipient's email address.
        // from: '"Support Team" <support@example.com>', // override default from
        subject: `${this.configService.get<string>('APP_NAME') } Email Confirmation`,  // The subject of the email.
        template: 'welcome/index',  // The name of the handlebars template to use.
        // html: fs.readFileSync(`${process.cwd()}${sep}views${sep}emails${sep}welcome${sep}index.html`, 'utf8'),
        context: { // The data to pass to the template.
          app_url:     this.configService.get<string>('APP_NAME'),  // The name of the application.
          verify_link: `${this.configService.get('APP_FRONTEND_URL')}/home/verify/email/${user.token}`, // The URL for the email verification link.
        },
      });

    } catch (error) {
      // Log any errors that occur during the sending of the email.
      this.logger.error(error);
      return false;
    }
  }


    /**
   * Sends a confirmation email to a user.
   * 
   * @param user - The user to send the email to.
   * @returns A Promise that resolves when the email is sent.
   */
  async createOrder(order: OrderEntity) {

    try{
      
      // Get the user associated with the order.
      let user = await order.user;

      // Send the email.
      return await this.mailerService.sendMail({
        to: user.email,  // The recipient's email address.
        subject: `${this.configService.get<string>('APP_NAME') } Order #${order.num_id} Created`,  // The subject of the email.
        template: 'order/create',  // The name of the handlebars template to use.
        context: { // The data to pass to the template.
          items:        order.items,
          order_number: order.num_id
        },
      });

    } catch (error) {
      // Log any errors that occur during the sending of the email.
      this.logger.error(error);
      return false;
    }
  }


  async payment(order: OrderEntity) {

    try{
      
      // Get the user associated with the order.
      let user = await order.user;

      // Send the email.
      return await this.mailerService.sendMail({
        to: user.email,  // The recipient's email address.
        subject: `${this.configService.get<string>('APP_NAME') } Payment Successful for Order #${order.num_id}`,  // The subject of the email.
        template: 'order/payment',  // The name of the handlebars template to use.
        context: { // The data to pass to the template.
          items:        order.items,
          order_number: order.num_id,
          transaction:  order.transaction
        },
      });

    } catch (error) {
      // Log any errors that occur during the sending of the email.
      this.logger.error(error);
      return false;
    }
  }  

  /**
   * Sends a confirmation email to a staff member.
   *
   * @param user - The staff member to send the email to.
   * @returns A Promise that resolves when the email is sent.
   */
  async sendStaffConfirmation(user: UserEntity) {
    // Construct the URL for the email verification link.
    let url = `${this.configService.get('APP_FRONTEND_URL')}/dashboard/verify/${user.token}`;

    // Send the email.
    return await this.mailerService.sendMail({
      to: user.email, // The recipient's email address.
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Welcome to  ${this.configService.get<string>('APP_NAME') } Confirm your Email`, // The subject of the email.
      template: 'welcome', // The name of the handlebars template to use.
      context: { // The data to pass to the template.
        app: this.configService.get<string>('APP_NAME'), // The name of the application.
        name: `${user.first_name} ${user.last_name}`, // The staff member's name.
        url, // The URL for the email verification link.
        contact: this.configService.get<string>('MAIL_FROM') // The contact email address.
      },
    });
  }

  /**
   * Sends an invoice email for a given order and user.
   *
   * @param order - The order for which the invoice is being sent.
   * @param user - The user for whom the invoice is being sent.
   * @returns A Promise that resolves to the result of sending the email.
   * @throws If there is an error sending the email, it will be logged and false will be returned.
   */
  async sendOrderInvoice(order: OrderEntity, user: UserEntity) {

    try {

      // Calculate the total amount of the order.
      let total = sum(order.items.map(item => item.price * item.quantity)).toFixed();
      // Get the base URL of the application.
      let url = this.configService.get<string>('APP_URL');

      // Send the email with the invoice template and the order, URL, user, and total as context.
      let sendMail = await this.mailerService.sendMail({
        to: user.email,
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

      return sendMail;

    } catch (error) {

      // Log any errors that occur during the sending of the email.
      this.logger.error(error);

      return false;

    }

  }

  /**
   * Sends a receipt email for a given order and user.
   *
   * @param order - The order for which the receipt is being sent.
   * @param user - The user for whom the receipt is being sent.
   * @returns A Promise that resolves to the result of sending the email.
   */
  async sendOrderReceipt(order: OrderEntity, user: UserEntity) {
    // Calculate the total amount of the order.
    let total = sum(order.items.map(item => item.price * item.quantity)).toFixed();
    // Get the base URL of the application.
    let url = this.configService.get<string>('APP_URL');

    // Send the email with the receipt template and the order, URL, user, and total as context.
    return await this.mailerService.sendMail({
      to:       user.email, // The email address of the recipient.
      from:    `Billing Team <billing@brandtoday.co.ke>`, // The email address of the sender.
      subject: `Order #${order.num_id} created.`, // The subject of the email.
      template: 'receipt', // The name of the template to use for the email.
      context: { // The data to be used in the email template.
        order, // The order object.
        user, // The user object.
        url, // The base URL of the application.
        total, // The total amount of the order.
      },
    });
  }
}