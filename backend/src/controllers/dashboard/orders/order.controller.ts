import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Logger, Param, ParseIntPipe, Post, Put, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminGuard } from 'src/guards';
import { OrderModel } from 'src/models';
@Controller('dashboard/orders')
export class DashboardOrderController {

  private readonly logger = new Logger(DashboardOrderController.name);

  /**
   * The constructor for the DashboardOrderController class.
   *
   * @param orderModel The order model instance.
   */
  constructor(
    // The order model instance.
    private orderModel: OrderModel,
  ) {}

  /**
   * Fetches paginated list of orders.
   *
   * @param page The page number of the results to retrieve. Defaults to 1.
   * @param limit The maximum number of results to retrieve per page. Defaults to 10.
   * @param req The request object.
   * @param res The response object.
   * @returns A JSON response containing the paginated list of orders.
   */
  @UseGuards(AdminGuard)
  @Get('')  
  async index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) queryPage: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) queryPerPage: number = 10,
    @Req() req: Request,  
    @Res() res: Response
  ) {

    try {

      // Paginate orders based on the provided query parameters
      let orders = await this.orderModel.find({ skip: (queryPage - 1) * (queryPerPage + 1), take: queryPerPage, relations: ['user'] });

      // Send the paginated list of orders as a JSON response
      return res.status(HttpStatus.OK).json({ orders });

    } catch (error) {

      // Log the error and send a JSON response with the appropriate status code
      this.logger.error(error);

      res.status(error.status).json({ orders: {} });

    }

  }   

  /**
   * Fetch an order by its ID and return it as a JSON response.
   *
   * @param orderId The ID of the order to fetch.
   * @param req The request object.
   * @param res The response object.
   * @returns A JSON response containing the fetched order.
   */
  @UseGuards(AdminGuard)
  @Put(':order/view')
  async show(
    @Param('order') orderId: string, // The ID of the order to fetch.
    @Req() req: Request, // The request object.
    @Res() res: Response // The response object.
  ) {

    try {

      // Fetch the order with the specified ID, including its associated user.
      let order = await this.orderModel.findOne({ where: { id: orderId }, relations: ['user'] });

      // Return the fetched order as a JSON response with a 200 status code.
      return res.status(HttpStatus.OK).json({ order });

    } catch(error) {

      // Log the error and return a JSON response with the appropriate status code.
      this.logger.error(error);
      
      res.status(error.status).json({order: {} });
    }

  }

}
