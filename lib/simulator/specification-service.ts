import { logger, RunnerInstance, Specification } from './types';
import { Utils } from './utils';
import Mocha, { Runner } from 'mocha';
import crypto from 'crypto';
import { NotFoundException } from './exception/not-found-exception';

export class SpecificationService {
    

    private _specifications: Specification[] = [];

    private _mochaOptions?:Mocha.MochaOptions = {};

    private _activeRunners: Map<string, Runner> = new Map();

    private _activeRunnerInstances: Map<string, RunnerInstance> = new Map();
    
    constructor(path: string, mochaOptions?: {}) {
        this._init(path);
        this._mochaOptions = mochaOptions;
    }


    private _init(path: string) {
        
        let specs = Utils.getSpecifications(path);
        this._specifications = specs.sort((a, b) => {
            if (a.order && b.order) {
                return a.order < b.order ? -1 : 1;
            } else {
                return -1;
            }
        });
    }
    
    public getSpecifications(): Specification[] {
        return this._specifications;
    }

    public getRunnerInstance(id: string): RunnerInstance {
        let runnerInstance = this._activeRunnerInstances.get(id);
        
        if (runnerInstance) {
            return runnerInstance;
        }

        throw new NotFoundException(`Unable to find instance with id ${id}`);
    }

    public run(): RunnerInstance {

        logger.info(`Specifications ${this._specifications}`);

        let mocha = new Mocha(this._mochaOptions);

        let files: string[] = [];

        this._specifications.forEach(s => {
            s.files.forEach(f => files.push(f));
        });

        files.forEach(f => {
            mocha.addFile(f);
        });

        const runner = mocha.run(failure => {
            if (failure > 0) { 
                logger.warn('One or more feature failed');
            }
        });

        const runnerInstance:RunnerInstance = {
            id: crypto.randomUUID(),
            intiatedOn: new Date(),
            pollIntervalInSecs: 20,
            completed: false
        };
        this._activeRunnerInstances.set(runnerInstance.id, runnerInstance);
        this._activeRunners.set(runnerInstance.id, runner);

        runner.on('end', () => {
            runnerInstance.completed = true;
            console.log(`Spec finished executing...`);
        });

        return runnerInstance;
    }
}