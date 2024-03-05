import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from 'src/services';
import { sep } from 'path';
import { ConfigService } from '@nestjs/config';

const path = require('path');

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => {
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        return {
          transport: `smtps://${config.get('MAIL_USER')}:${config.get('MAIL_PASSWORD')}@${config.get('MAIL_HOST')}`,
          defaults: {
            from: `"No Reply" <${config.get('MAIL_FROM')}>`,
          },
          template: {
            dir: `${process.cwd()}${sep}views${sep}emails`,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          }
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}