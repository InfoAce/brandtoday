import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { get } from 'lodash';

@Controller('signup')
export class SignupController {
    @Get('')
    @Render('pages/signup')
    async index(@Req() req: Request,  @Res() res: Response) {
      return res.render(
        'pages/signup',
        {
          csrf: get(req,'csrfToken')()
        }
      )
    }   

}
