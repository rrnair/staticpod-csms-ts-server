import express from 'express';
import moment from 'moment-timezone';
import { SpecificationService } from './simulator/specification-service';
import { Utils } from './simulator/utils';
import path from 'path';

const PORT: number = 8080;

// Create Express Application, we add routes and middleware to this application to handle request/response
const app = express();

// Router encapsulates all the http routes exposed in the application
let router = express.Router();

// Validate specification file 
Utils.isValidSpecification(__dirname, Utils.SPEC_SCHEMA_FILE);

const currentDateTime = moment().tz('Australia/Sydney').format('YYYY/MM/DD/HH:mm:ss');
const reportDirectory = path.resolve(__dirname, `../execution-report/${currentDateTime}`)


const mochaOptions: Mocha.MochaOptions = {
    timeout: 200000,
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: reportDirectory,
        reportTitle: "Staticpod CSMS Compliance Report",
        reportPageTitle: "Compliance Report",
        charts: true
    }
};
// Initialize Service
const specificationService = new SpecificationService(__dirname, mochaOptions);

// Add routes we want to expose
router.get('/', (request: express.Request, response: express.Response) => {
    console.log(`You have reached default base route of the application at : ${request.baseUrl}`);
    let specifications = specificationService.getSpecifications();
    response.status(200).json(specifications).send();
});

router.get('/specs/run', (request: express.Request, response: express.Response) => {
    console.log(`Starting tests...${request.path}`);
    specificationService.run();
    response.status(200).json({message: 'Successfully initiated tests'});
});

// Set application to use Router
app.use(router);


app.listen(PORT, () => {
    console.log(`Test Simulator started listeing on Port: ${PORT}, Time: ${new Date()}`);
});
