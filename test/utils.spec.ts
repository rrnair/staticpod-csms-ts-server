import { Utils } from "../lib/simulator/utils";
import { expect } from 'chai';

describe('Utils reads all the Specificaitions', () => {
    it('Utils finds specifications recursively', async () => {
        let specifications = await(await Utils.getSpecifications(`${__dirname}/../lib/simulator`));
        expect(specifications).is.not.null;
        expect(specifications.length).greaterThan(1);
    });

    it('Validate Specifications', () => {
       expect(Utils.isValidSpecification(`${__dirname}/../lib/simulator`, Utils.SPEC_SCHEMA_FILE)).is.true;
    });
});