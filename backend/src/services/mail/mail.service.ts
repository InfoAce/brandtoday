import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entities';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendUserConfirmation(user: UserEntity) {
    const url = `${this.configService.get('APP_URL')}/verify/email/${user.token}`;

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
    const url = `${this.configService.get('APP_URL')}/dashboard/verify/${user.token}`;

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
}