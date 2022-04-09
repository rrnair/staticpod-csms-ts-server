import { expect } from "chai";
import { SpecificationService } from "../lib/simulator/v201/specification-service";
import loki from 'lokijs';
import { RunnerInstance } from "../lib/simulator/v201/types";

describe('Specification feature specs', () => {
    it('Specifications are fetched and sorted', () => {
        let db = new loki('dist/runnerInstances');
        let coll = db.addCollection<RunnerInstance>('runnerInstances');
        let specificationService = new SpecificationService(`${__dirname}/../`, coll);
        let specs = specificationService.getSpecifications();

        expect(specs[0].order).is.eq(1);
    });
});