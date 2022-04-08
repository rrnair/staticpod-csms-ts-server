import { Runner } from "mocha";
import winston from "winston";

export interface Specification {
    id: string,
    
    order?: number,

    name: string, 

    title: string,
    
    description?: string, 

    enabled: boolean,

    files: string[],

    features: Feature[]

}

export interface Feature {
    
    id: string,
    
    order?: number,

    name: string, 

    title: string,
    
    description?: string, 

    objective?: string

    functionalBlock: string

}

export interface RunnerInstance {

    id: string,

    intiatedOn: Date,

    pollIntervalInSecs: number,

    completed: boolean
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/out.log' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});