import { logger, Specification } from './types';
import { Utils } from './utils';
import Mocha from 'mocha';

export class SpecificationService {
    

    private _specifications: Specification[] = [];

    private _mochaOptions?:Mocha.MochaOptions = {
    };
    
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

    public run() {

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

        runner.on('end', () => {
            console.log(`Spec finished executing...`);
        });
    }
}