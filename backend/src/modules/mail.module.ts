import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from 'src/services';
import { sep } from 'path';
import { ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

const path = require('path');

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => {
        return {
          transport: {              
              auth: {
                  user: config.get('MAIL_USER'),
                  pass: config.get('MAIL_PASSWORD')
              },
              port: config.get('MAIL_PORT'),
              host: config.get('MAIL_HOST')
          },
          defaults: {
            from: `"No Reply" <${config.get('MAIL_FROM')}>`,
          },
          template: {
            dir: `${process.cwd()}${sep}views${sep}emails`,
            adapter: new PugAdapter({
              inlineCssEnabled: true, 
              inlineCssOptions:{ 
                baseUrl: process.cwd().replace('backend',`frontend${sep}public${sep}assets${sep}global${sep}`).replace(/\\/g,'/'),    
                keepLinkTags: true          
              } 
            }),
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