import express, {Router} from "express";
import { ApplicationException } from "./exception/application-exception";
import { SpecificationService } from "./specification-service";
import { logger } from "./types";

/**
 * Declare all your routes here.
 * 
 * @param specificationService Service instance that works behind the route
 * @returns Router instance containing all REST API routes
 */
export const routesv201 = (specificationService: SpecificationService): Router => {
    
    // Our REST API will have the v2 version specified
    const BASE_PATH: string = '/v2';

    // Router instance where we set all the routes
    const router: express.Router = express.Router();


    // Base route, returns all available specifications and features
    router.get(`${BASE_PATH}/`, (request: express.Request, response: express.Response) => {
        logger.info(`You have reached default base route of the application at : ${request.baseUrl}`);
        let specifications = specificationService.getSpecifications();
        response.status(200).json(specifications).send();
    });

    // Run all specifications
    router.get(`${BASE_PATH}/specs/run`, (request: express.Request, response: express.Response) => {
        logger.info(`Starting tests...${request.path}`);
        let runnerInstance = specificationService.run();

        response.status(200).json(runnerInstance);
    });

    // Get details of a mocah run by its id
    router.get(`${BASE_PATH}/specs/run/:id`, (request: express.Request, response: express.Response) => {
        try {
            logger.info(`Grabbing status for ${request.params.id}`);

            let runnerInstance = specificationService.getRunnerInstance(request.params.id);

            response.status(200).json(runnerInstance);
        } catch(error) {
            // Check whether the error is custom error
            if (error instanceof ApplicationException) {
                response.status(error.getCode()).json(error);
            } else {
                // We dont know what this error is, send 400
                response.status(400).send('Failed to retrieve status');
            }
        }
    });

    // Return the configured Router instance that contains all the routes
    return router;
}
