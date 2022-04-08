import { logger, Specification } from "./types";
import fs from 'fs';
import Ajv, { SchemaObject } from "ajv";
import path from 'path';


export class Utils {

    
    public static SPEC_FILE_NAME:string = 'specification.json';

    public static SPEC_SCHEMA_FILE: string = `${__dirname}/../specification-schema.json`;
    

    public static getSpecifications(dir: string): Specification[] {
        
        return Utils.getSpecInstances(dir, this.SPEC_FILE_NAME);
    }
    public static getSpecInstances(dir: string, file: string): Specification[] {
        
        let specifications: Specification[] = [];
        
        let specs: string[] = Utils.getSpecFiles(dir, file, []);
        specs.forEach(s => {
            specifications.push(JSON.parse(s) as Specification);
        });

        logger.info(`Collected (${specifications.length}) Specifictions`);

        return specifications;
    }

    public static getSpecFiles(dir: string, file: string, specifications: string[]): string[] {
        
        let files: string[] = fs.readdirSync(dir);
        files.forEach(f => {
            let current = path.join(dir, f);
            let stats = fs.statSync(current);
            if (stats.isFile() && f.endsWith(file)) {
                specifications.push(fs.readFileSync(current, 'utf-8').toString());
            } else if (stats.isDirectory()) {
                Utils.getSpecFiles(current, file, specifications);
            }
        });

        return specifications;
    }

    public static isValidSpecification(dir: string, specSchema: string) {
        
        const ajv = new Ajv();

        const validate = ajv.compile(JSON.parse(fs.readFileSync(specSchema).toString()) as SchemaObject);

        Utils.getSpecFiles(dir, Utils.SPEC_FILE_NAME, []).forEach(f => {
            
            let json = JSON.parse(f);

            if (! validate(json)) {
                throw new Error(`Specification is not a valid specification`);
            }
        });
        return true;
    }
}
