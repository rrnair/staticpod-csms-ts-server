/* Copyright (c) 2022 staticpod LLC or its affiliates. All rights reserved. @author: ratheesh.nair */

import winston from "winston";

/**
 * Declare all common classes/interfaces/constants here. These are common across all version implementaions of OCPP
 */
export interface Specification {

    // Unique id of the specification
    id: string,
    
    // Sort Order 
    order: number,

    // Name of the specification
    name: string, 

    // Title of the specification thats displayed in the UI
    title: string,

    // A short descritption of what this specification does
    description?: string

    // Is the specification enabled
    enabled: boolean,

    // One of more Feature files under the specification
    files: string[],

    // One or more Features under this specification
    features: Feature[]

}

/**
 * A feature is a test case, its called feature since it tests a feature implementation
 */
export interface Feature {
    
    // Feature id
    id: string,
    
    // Sort order
    order: number,

    // Name of the feature
    name: string, 

    // Title of the feature
    title: string,
    
    // A short description of the feature
    description?: string, 

    // An optional additional description 
    objective?: string

    // Functional block identifier, like a category -  Provisioning, Authorization, FirmwareManagement etc
    functionalBlock: string

}

/**
 * Details of a mocha run
 */
export interface RunnerInstance {

    // Unique id of the mocha run 
    _id: string,

    // When the specification test was initiated
    intiatedOn: Date,

    // Interval to poll for the runner details from UI
    pollIntervalInSecs: number,

    // Is the run complete?
    completed: boolean,

    // Feature test report directory
    reportDirectory: string,

    status: RunnerStatus
}

export enum RunnerStatus {
    Initiated,

    CompletedSuccessfully,

    CompletedWithfailures,
}

/**
 * Application wide logger
 */
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/out.log' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});