import { logger, RunnerInstance, Specification } from './types';
import { Utils } from './utils';
import Mocha, { Runner } from 'mocha';
import crypto from 'crypto';
import { NotFoundException } from './exception/not-found-exception';

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
    
    /**
     * Construct service instance
     * 
     * @param path Base directory where specifications are available
     * @param mochaOptions Mocha configuration options
     */
    constructor(path: string, mochaOptions?: {}) {
        this._init(path);
        this._mochaOptions = mochaOptions;
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
    
        let runnerInstance = this._activeRunnerInstances.get(id);
        
        // Do we have a runner instance for the specified id    
        if (runnerInstance) {
            return runnerInstance;
        }

        // We dont know which runner instance is asked, throw an error
        throw new NotFoundException(`Unable to find instance with id ${id}`);
    }

    /**
     * Initiate a specification run, all the features under the specification are run. Each instantiation
     * of a specification is job that runs in the background and a handle (RunnerInstance) details are returned
     * 
     * @returns Runner instance with details of the specification run
     */
    public run(): RunnerInstance {

        logger.info(`Specifications ${this._specifications}`);

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
            id: crypto.randomUUID(),
            intiatedOn: new Date(),
            pollIntervalInSecs: 20,
            completed: false
        };

        // Cache the runner instance and mocha Runner instance
        this._activeRunnerInstances.set(runnerInstance.id, runnerInstance);
        this._activeRunners.set(runnerInstance.id, runner);

        // Is the run completed?
        runner.on('end', () => {
            // Mark the runner instance as completed
            runnerInstance.completed = true;

            console.log(`Spec finished executing...`);
        });

        // Return the runner details for UI to refer back
        return runnerInstance;
    }
}