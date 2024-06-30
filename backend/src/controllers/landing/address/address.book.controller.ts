import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientGuard } from '../../../guards';
import { Request, Response } from 'express';
import { get, set } from 'lodash';
import { AddressValidation } from 'src/validation';
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
        let addresses = await this.addressBookModel.find({ user_id: user.id });

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
     * @param {AddressValidation} body - The address validation object.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async store(
        // The address validation object
        @Body() body: AddressValidation,
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
}
