import express, {Router} from "express";
import { ApplicationException } from "./exception/application-exception";
import { SpecificationService } from "./specification-service";
import { logger } from "./types";

export const routes = (specificationService: SpecificationService): Router => {
    
    let router: express.Router = express.Router();

    router.get('/', (request: express.Request, response: express.Response) => {
        logger.info(`You have reached default base route of the application at : ${request.baseUrl}`);
        let specifications = specificationService.getSpecifications();
        response.status(200).json(specifications).send();
    });

    router.get('/specs/run', (request: express.Request, response: express.Response) => {
        logger.info(`Starting tests...${request.path}`);
        let runnerInstance = specificationService.run();

        response.status(200).json(runnerInstance);
    });

    router.get('/specs/run/:id', (request: express.Request, response: express.Response) => {
        try {
            logger.info(`Grabbing status for ${request.params.id}`);

            let runnerInstance = specificationService.getRunnerInstance(request.params.id);

            response.status(200).json(runnerInstance);
        } catch(error) {
            if (error instanceof ApplicationException) {
                response.status(error.getCode()).json(error);
            } else {
                response.status(400).send('Failed to retrieve status');
            }
        }
    });

    return router;
}
