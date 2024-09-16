import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from 'src/services';
import { sep } from 'path';
import { ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => {
        return {
          transport: {   
            name: config.get('MAILER_TYPE'),           
            auth: {
              user: config.get('MAIL_USER'),
              pass: config.get('MAIL_PASSWORD')
            },
            secure: true,
            port: parseInt(config.get('MAIL_PORT')),
            host: config.get('MAIL_HOST')
          },
          defaults: {
            from: `"No Reply" <${config.get('MAIL_FROM')}>`,
          },
          template: {
            dir: `${process.cwd()}${sep}views${sep}emails`,
            adapter: new PugAdapter(),
            options: {
              strict: false,
            },
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}