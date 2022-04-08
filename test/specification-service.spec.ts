import { expect } from "chai";
import { SpecificationService } from "../lib/simulator/specification-service";


describe('Specification feature specs', () => {
    it('Specifications are fetched and sorted', () => {
        let specificationService = new SpecificationService(`${__dirname}/../`);
        let specs = specificationService.getSpecifications();

        expect(specs[0].order).is.eq(1);
    });
});