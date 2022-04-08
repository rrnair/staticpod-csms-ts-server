
describe('Boot Notification Specifications', () => {
    it('B01 - Chargign station is powering up to register to CSMS', () => {
        // Initiate a boot notification request

        // Once CSMS responds to the request with accepted, initiate a status notification request for each connector in the CS

        // Once status notifiction is completed for each connector, send Heartbeat request

    });


    it('B02 - CSMS when busy sends a Boot notification response with status - Pending', () => {
        // Simulate CSMS busy state

        // Initiate a boot notification request

        // Once CSMS responds to the request with Pending, initiate a status notification request for each connector in the CS

    });

    it('B02 - CSMS when too loaded sends a Boot notification response with status - Rejected', () => {
        // Simulate CSMS load state

        // Initiate a boot notification request

        // Once CSMS responds to the request with Rejected, initiate a status notification request for each connector in the CS

    });
});