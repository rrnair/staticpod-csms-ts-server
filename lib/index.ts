import express from 'express';
import moment from 'moment-timezone';
import { SpecificationService } from './simulator/specification-service';
import { Utils } from './simulator/utils';
import path from 'path';
import { logger } from './simulator/types';
import { routes } from './simulator/routes';

const PORT: number = 8080;

// Create Express Application, we add routes and middleware to this application to handle request/response
const app = express();


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

// Setup rotues, a Router encapsulates all the http routes exposed in the application
app.use(routes(specificationService));

app.listen(PORT, () => {
    logger.info(`Test Simulator started listeing on Port: ${PORT}, Time: ${new Date()}`);
});
