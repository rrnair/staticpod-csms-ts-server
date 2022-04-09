/* Copyright (c) 2022 staticpod LLC or its affiliates. All rights reserved. @author: ratheesh.nair */

import express, { Router } from 'express';
import moment from 'moment-timezone';
import { SpecificationService } from './specification-service';
import { Utils } from './utils';
import path from 'path';
import { logger, RunnerInstance } from './types';
import { routesv201 } from './routes';
import loki from 'lokijs';

export const apiv201 = () => {

    const runnerInstanceDb = path.resolve(__dirname, `../../../db/v201/runnerInstances.db`);

    // Instantiate database.
    const lokidb = new loki('runnerInstances.db', {autoload: true, autosave: true, persistenceMethod: 'fs', verbose: true});
    const runnerCollection = lokidb.addCollection<RunnerInstance>('runnerInstances', {indices: ['_id']});
    
    
    const currentDateTime = moment().utcOffset('+05:30').format('YYYY/MM/DD/HH:mm:ss');
    const reportDirectory = path.resolve(__dirname, `../../../execution-report/${currentDateTime}`);

    const PORT: number = 8080;
    const REPORT_DIR: string = process.env.REPORT_DIR || reportDirectory

    // Create Express Application, we add routes and middleware to this application to handle request/response
    const app = express();


    // Validate specification file 
    Utils.isValidSpecification(__dirname, Utils.SPEC_SCHEMA_FILE);

    // Mocha reporter options
    const mochaOptions: Mocha.MochaOptions = {
        timeout: 200000,
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: REPORT_DIR,
            reportTitle: "Staticpod CSMS Compliance Report",
            reportPageTitle: "OCPP Compliance Report",
            charts: true
        }
    };

    // Initialize Service
    const specificationService = new SpecificationService(__dirname, runnerCollection, mochaOptions);

    // Setup rotues, a Router encapsulates all the http routes exposed in the application
    const router: Router = routesv201(specificationService);
    app.use(router);

    // Start listening
    app.listen(PORT, () => {
        logger.info(`Test Simulator started listeing on Port: ${PORT}, Time: ${new Date()}`);
    });
}