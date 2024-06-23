import { ForbiddenException, HttpException, Injectable, Logger, NotFoundException, PreconditionFailedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { UserModel } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull, omit } from 'lodash';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
@Injectable()
export class AuthService {

    private readonly config;

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userModel: UserModel,
        private configService: ConfigService,
        private jwtService: JwtService
    ){
        this.config = this.configService.get<any>('app');
    }

    /**
     * Find user by email address
     * @param email 
     * @returns 
     */
    async findOneByEmail(email: string){
        try {
        
            return await this.userModel.findOneBy({ where: { email }, select:['id','email','password']});
        
        } catch (error) {

            this.logger.error(error);
        
        }
    }

    /**
     * Sign in user
     *
     * @param {string} email - The user's email address
     * @returns {Promise<Object>} - The signed in user object along with a JWT token
     * @throws {PreconditionFailedException} - If JWT expiry time has not been set or if the application has not been properly configured
     * @throws {HttpException} - If an error occurs during the sign in process
     */
    async signIn(email): Promise<any> {
        try {
            // Check if JWT auth is set up
            if (
                isEmpty(this.config['JWT_EXPIRES_IN']) ||
                isEmpty(this.config['JWT_SESSION_KEY'])
            ) {
                throw new PreconditionFailedException(
                    'The application has not been properly configured.'
                );
            }

            // Check if expiry duration is set
            if (!this.config['JWT_SESSION_KEY'].includes('s')) {
                throw new PreconditionFailedException(
                    'JWT expiry time has not been set'
                );
            }

            // Find user model
            const user = await this.userModel.findOne({
                where: { email },
                select: ['id', 'first_name', 'last_name', 'email', 'image', 'email_verified_at']
            });

            // Jwt signing
            const token = await this.jwtService.signAsync(
                {
                    ...omit(user, ['company'])
                },
                {
                    expiresIn: this.configService.get<string>(
                        'app.JWT_EXPIRES_IN'
                    ),
                    secret: this.configService.get<string>('app.JWT_SESSION_KEY')
                }
            );

            // Calculate expiry date time
            const expires_in = moment()
                .add(
                    parseInt(
                        this.configService.get<string>('app.JWT_EXPIRES_IN')
                    ),
                    'seconds'
                )
                .unix();

            return {
                token: { expires_in, token_type: `Bearer`, token },
                user:  omit(user, ['company'])
            };
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(error.message, error.status);
        }
    }

    /**
     * Authenticates the user
     * 
     * @param email The user's email address
     * @param password The user's password
     * @returns {Promise<Object>} The signed in user object along with a JWT token
     * @throws {UnauthorizedException} If the user's email or password is incorrect
     * @throws {ForbiddenException} If the user's account is not verified
     * @throws {HttpException} If an error occurs during the login process
     */
    async login(email, password){
        try {

            // Find user by email address
            let user = await this.userModel.findOne({ 
                where: { email }, 
                select:['id','email','password','email_verified_at'] 
            });            
        
            // Check if user exists and password is correct
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new UnauthorizedException('Incorrect username or password');
            }
            
            // Check if user's account is verified
            if(isNull(user.email_verified_at)) {
                throw new ForbiddenException('Your account is not verified.');
            }

            // Sign in user
            return await this.signIn(email);

        } catch (error) {

            // Log and throw error
            this.logger.error(error);
            
            throw new HttpException(error.message,error.status);
        }        
    }

    /**
     * Validate user model 
     * @param username 
     * @param password 
     * @returns 
     */
    async validateUser(username, password){
        const foundUser = await this.userModel.findOneBy({ email: username });
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
          throw new UnauthorizedException('Incorrect username or password');
        }
        const { password: _password, ...retUser } = foundUser;
        return retUser;
    }
}
