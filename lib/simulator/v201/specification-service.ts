/* Copyright (c) 2022 staticpod LLC or its affiliates. All rights reserved. @author: ratheesh.nair */

import { logger, RunnerInstance, RunnerStatus, Specification } from './types';
import { Utils } from './utils';
import Mocha, { Runner } from 'mocha';
import crypto from 'crypto';
import { NotFoundException } from './exception/not-found-exception';
import loki from 'lokijs';
/**
 * Service instance for validating, running features
 */
export class SpecificationService {
    

    // A list of available specification instances
    private _specifications: Specification[] = [];

    // Mocha confguration options 
    private _mochaOptions?:Mocha.MochaOptions = {};

    // Cache of Active mocha runners, this is retrieved when the UI presents the runnner instance id
    private _activeRunners: Map<string, Runner> = new Map();

    // Cache of all runner instances, these are serialized as response to UI
    private _activeRunnerInstances: Map<string, RunnerInstance> = new Map();

    private _runnerCollection: loki.Collection<RunnerInstance>;
    
    /**
     * Construct service instance
     * 
     * @param path Base directory where specifications are available
     * @param mochaOptions Mocha configuration options
     */
    constructor(path: string, runnerDb: loki.Collection<RunnerInstance>, mochaOptions?: {}) {
        this._init(path);
        this._mochaOptions = mochaOptions;
        this._runnerCollection = runnerDb;
    }


    /**
     * Initialize service instance.
     * 
     * @param path Base diectory where specifications are available
     */
    private _init(path: string) {

        // Get all specs
        let specs = Utils.getSpecifications(path);

        // Sort specs by order, lowest comes first
        this._specifications = specs.sort((a, b) => {
            if (a.order && b.order) {
                return a.order < b.order ? -1 : 1;
            } else {
                return -1;
            }
        });
    }
    
    /**
     * Returns specifications
     * 
     * @returns Available specifications
     */
    public getSpecifications(): Specification[] {
        return this._specifications;
    }

    /**
     * Returns a runner instance, for each specification start, a runner instance is created.
     * 
     * @param id Runner instance id
     * @returns RunnerInstance of specification run
     */
    public getRunnerInstance(id: string): RunnerInstance {
    
        let runnerInstance = null;//this._activeRunnerInstances.get(id);
        let doc: RunnerInstance | null;
        
        // Do we have a runner instance for the specified id    
        if (runnerInstance) {
            logger.info(`Returning cached instance of runner instance with id ${id}`);
            doc = runnerInstance;
        } else {
            console.log(`Find all ${this._runnerCollection.find({'_id': id})}`);
            // Find from database and cache it.
            doc = this._runnerCollection.findOne({'_id': id});
            console.log(`from db ${JSON.stringify(doc)}`);
            if (doc) {
                
                logger.info('Found runner instance from datastore, caching it');
                // Cache it
                this._activeRunnerInstances.set(doc._id, doc);

            } else {
                logger.error(`Runner instance with id ${id} not found in datastore`);
            }
        }

        console.log(`Outside : ${JSON.stringify(doc)}`);
        if (doc) {
            return doc;
        } else {
            // We dont know which runner instance is asked, throw an error
            throw new NotFoundException(`Unable to find instance with id ${id}`);
        }
    }

    /**
     * Initiate a specification run, all the features under the specification are run. Each instantiation
     * of a specification is job that runs in the background and a handle (RunnerInstance) details are returned
     * 
     * @returns Runner instance with details of the specification run
     */
    public run(): RunnerInstance {

        logger.info(`Running specifications and features...`);

        // Construct Mocha instance
        let mocha = new Mocha(this._mochaOptions);

        let features: string[] = [];

        // Find the mocha tests defined in the specification.
        this._specifications.forEach(s => {

            // `files` entry in the Json may be an array or single entry, flatten the array
            s.files.forEach(f => features.push(f));
        });

        // Add features to mocha instance
        features.forEach(f => {
            mocha.addFile(f);
        });

        // Initiate a mocha run
        const runner = mocha.run(failure => {
            // A non zero value here means one of the feature test failed
            if (failure > 0) { 
                logger.warn('One or more feature failed');
            }
        });

        // Create a runner instance with run details
        const runnerInstance:RunnerInstance = {
            _id: crypto.randomUUID({disableEntropyCache: true}),
            intiatedOn: new Date(),
            pollIntervalInSecs: 20,
            completed: false,
            reportDirectory: this._mochaOptions?.reporterOptions?.reportDirectory,
            status: RunnerStatus.Initiated
        };

        // Add runner instance details to database
        this._runnerCollection.insert(runnerInstance);

        // Cache the runner instance and mocha Runner instance
        this._activeRunnerInstances.set(runnerInstance._id, runnerInstance);
        this._activeRunners.set(runnerInstance._id, runner);

        // Is the run completed?
        runner.once(Mocha.Runner.constants.EVENT_RUN_END, () => {
            // Mark the runner instance as completed
            runnerInstance.completed = true;
            if (runner.stats && runner.stats?.failures > 0) {
                runnerInstance.status = RunnerStatus.CompletedWithfailures;
            } else {
                runnerInstance.status = RunnerStatus.CompletedSuccessfully;
            }

            // Update status in database
            this._runnerCollection.update(runnerInstance);

            logger.info(`Specs with id ${runnerInstance._id} finished executing...${JSON.stringify(runner.stats)}`);
        });

        // Return the runner details for UI to refer back
        return runnerInstance;
    }

    
}