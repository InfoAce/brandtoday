import { InjectQueue, Process, Processor } from "@nestjs/bull";
import { Injectable, Logger, Scope } from "@nestjs/common";
import { AmrodService } from "src/services";

@Injectable()
@Processor({
    name:'amrod',
    scope: Scope.REQUEST
})
export class AmrodQueue {

    private readonly logger = new Logger(AmrodQueue.name);

    constructor(
        private readonly amrodService: AmrodService
    ) {}

    @Process('login')
    async synchronize(job){

    }
}