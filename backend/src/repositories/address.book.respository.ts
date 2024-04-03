import { Repository } from 'typeorm';
import { AddressBookEntity } from '../entities'

export class AddressBookRepository extends Repository<AddressBookEntity>{}