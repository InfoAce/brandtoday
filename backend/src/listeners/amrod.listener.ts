import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AmrodLoginEvent } from "src/events";
import { AmrodService } from "src/services";

export class AmrodListener {

    constructor(
        private amrodService: AmrodService,
        private eventEmitter: EventEmitter2
    ){}

    /**
     * 
     * @param payload 
     */
    @OnEvent('login')
    async handleAmrodLoginEvent(data: AmrodLoginEvent) {

        try {
            
            // await this.amrodService.login(data);

        } catch (error) {
            
            console.log(error);
        }

    }
}