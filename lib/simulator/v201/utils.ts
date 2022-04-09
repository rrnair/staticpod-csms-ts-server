/* Copyright (c) 2022 staticpod LLC or its affiliates. All rights reserved. @author: ratheesh.nair */

import { logger, Specification } from "./types";
import fs from 'fs';
import Ajv, { SchemaObject } from "ajv";
import path from 'path';

/**
 * Implement utlitly functions here
 */
export class Utils {

    // Our specification indicates the available specifications and features. This is used in UI to display 
    public static SPEC_FILE_NAME:string = 'specification.json';

    // Schema to validate above specification content
    public static SPEC_SCHEMA_FILE: string = `${__dirname}/../../specification-schema.json`;
    

    /**
     * Fetch all available specification declarations.
     * 
     * @param dir Base bir, the specifications are searched recursively
     * @returns Specification [] all specification
     */
    public static getSpecifications(dir: string, file: string = Utils.SPEC_FILE_NAME): Specification[] {
        
        let specifications: Specification[] = [];
        
        // Get all specification files
        let specs: string[] = Utils.getSpecFiles(dir, file, []);

        // Go throgh each specification content and conver to Specification instances
        specs.forEach(s => {
            specifications.push(JSON.parse(s) as Specification);
        });

        logger.info(`Collected (${specifications.length}) Specifictions`);

        // Return what we got
        return specifications;
    }

    /**
     * Returns all the spefication file contents.
     * 
     * @param dir Base directory where specification files are stored
     * @param file Name pattern of the specification file
     * @param specifications Array of Specification, this will be filled with the specification file paths
     * @returns An array of specification files that are found in the `dir`
     */
    public static getSpecFiles(dir: string, file: string, specifications: string[]): string[] {
        
        // Get all directories in the current level
        let files: string[] = fs.readdirSync(dir);
        let current: string;
        let stats: fs.Stats; 

        // Go through each of the directories and find specification files
        files.forEach(f => {
            
            current = path.join(dir, f);

            stats = fs.statSync(current);

            // Is this a file and ends with `specification.json`
            if (stats.isFile() && f.endsWith(file)) {
                // Read the contents
                specifications.push(fs.readFileSync(current, 'utf-8').toString());

            } else if (stats.isDirectory()) {
                // This is a directory, find the files under this directory
                Utils.getSpecFiles(current, file, specifications);
            }
        });

        // Return what we got
        return specifications;
    }

    /**
     * Verifies whether all the specification under the specified base directory is a valid according to the Json 
     * specification schema
     * 
     * @param dir Base directory where specification files are available
     * @param specSchema JSON schema of specification content
     * @returns True if all specifications validated successfully
     */
    public static isValidSpecification(dir: string, specSchema: string): boolean {
        
        const ajv = new Ajv();

        // Compile Json schema
        const validate = ajv.compile(JSON.parse(fs.readFileSync(specSchema).toString()) as SchemaObject);

        // Get all specification files 
        Utils.getSpecFiles(dir, Utils.SPEC_FILE_NAME, []).forEach(f => {
            
            // Convert to Json object instance
            let json = JSON.parse(f);

            // Validate specification
            if (! validate(json)) {
                throw new Error(`Specification ${f} is not a valid specification`);
            }
        });

        // All good, return true
        return true;
    }
}
