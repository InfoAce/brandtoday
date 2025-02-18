import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ClientGuard } from '../../../guards';
import { Request, Response } from 'express';
import { get, set } from 'lodash';
import { CreateAddressValidation, UpdateAddressValidation } from 'src/validation';
import { AddressBookModel } from 'src/models';


@Controller('addresses')
export class AddressBookController {

    private logger = new Logger(AddressBookController.name);

    /**
     * The address book model dependency injection.
     */
    private readonly addressBookModel: AddressBookModel;

    /**
     * Constructor for the address book controller.
     *
     * @param {AddressBookModel} addressBookModel - The address book model.
     */
    constructor(addressBookModel: AddressBookModel) {
        this.addressBookModel = addressBookModel;
    }

    @UseGuards(ClientGuard)
    @Get('')
    /**
     * Retrieves the user's address book.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async index(
      @Req() req: Request,  // The request object
      @Res() res: Response // The response object
    ) {

      try {
        
        // Get the authenticated user
        let user      = get(req,'user');
        
        // Retrieve the user's address book
        let addresses = await this.addressBookModel.find({ where:{ user_id: user.id } });

        // Return the user's address book as a JSON response with a 200 status code
        return res.status(HttpStatus.OK).json({ addresses });

      } catch(error) {

        this.logger.error(error);

      }

    }   

  @UseGuards(ClientGuard)
  @Post('')
  /**
   * Adds a new address to the user's address book.
   *
   * @param {CreateAddressValidation} body - The address validation object.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async store(
      // The address validation object
      @Body() body: CreateAddressValidation,
      // The request object
      @Req()  req:  Request,
      // The response object
      @Res()  res:  Response
  ) {
      try {
          // Get the authenticated user
          let user    = get(req,'user');
          // Save the new address to the user's address book
          let address = await this.addressBookModel.save(set(body,'user_id',user.id));

          // Return the newly created address as a JSON response with a 200 status code
          return res.status(HttpStatus.OK).json({ address });
      } catch(err) {
          // Handle any errors that occur during the operation
      }
  } 

  @UseGuards(ClientGuard)
  @Put(':address/show')
  /**
   * Retrieves an address from the user's address book by its ID.
   * 
   * @param {string} addressId - The ID of the address to fetch.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} - A promise that resolves with the address data.
   */
  async show(
      @Param('address') addressId: string, // The ID of the address to fetch.
      @Req()  req:  Request,               // The request object.
      @Res()  res:  Response               // The response object.
  ) {
    try {
      // Retrieve the address from the address book using the provided ID.
      let address = await this.addressBookModel.findOne({ where: { id: addressId }});

      // Return the retrieved address as a JSON response with a 200 status code.
      return res.status(HttpStatus.OK).json({ address });
    } catch(error) {
      // Handle any errors that occur during the operation by returning an error response.
      res.status(error.status).json({ address: {}, message: error.message });
    }
  } 

  @UseGuards(ClientGuard)
  @Put(':address/update')
  /**
   * Updates an existing address in the user's address book.
   *
   * @param {UpdateAddressValidation} body - The address validation object containing the updated address details.
   * @param {string} addressId - The ID of the address to update.
   * @param {Request} req - The request object containing user information.
   * @param {Response} res - The response object to send the result.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async update(
      @Body() body: UpdateAddressValidation,   // The address validation object
      @Param('address') addressId: string,     // The ID of the address to update
      @Req() req: Request,                     // The request object
      @Res() res: Response                     // The response object
  ) {
    try {
      // Update the address in the user's address book with the provided ID and body
      let address = await this.addressBookModel.update({ id: addressId }, body);

      // Return the updated address as a JSON response with a 200 status code
      return res.status(HttpStatus.OK).json({ address });
    } catch (error) {
      // Handle any errors that occur during the operation by returning an error response
      res.status(error.status).json({ address: {}, message: error.message });
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
  @UseGuards(ClientGuard)
  @Delete(':address/delete')
  async delete(
    @Param('address') addressId: string, // The ID of the order to fetch.
    @Req() req: Request, // The request object.
    @Res() res: Response // The response object.
  ) {

    try {

      // Fetch the order with the specified ID, including its associated user.
      let address = await this.addressBookModel.delete({ id: addressId });

      // Return the fetched order as a JSON response with a 200 status code.
      return res.status(HttpStatus.OK).json({ address });

    } catch(error) {

      // Log the error and return a JSON response with the appropriate status code.
      this.logger.error(error);
      
      res.status(error.status).json({order: {} });
    }

  }    
}
