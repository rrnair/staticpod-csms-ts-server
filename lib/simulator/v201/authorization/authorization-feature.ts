/* Copyright (c) 2022 staticpod LLC or its affiliates. All rights reserved. @author: ratheesh.nair */

/**
 * Feature tests for Authorization module. Use the Id as mentioned in the use-case of OCPP v2.0.1 specification.
 * 
 * This Functional feature tests all the authorization-related functionalities, it contains different ways of authorizing 
 * a user, online and/or offline and the AuthorizeRequest message handling/behavior, Authorization Cache functionality, etc.
 */

describe('Different modes of Authorizations are supported by CSMS', () => {
    it('C01 - EV Driver Authorization using RFID', () => {});
    it('C02 - Authorization using a start button', () => {});
    it('C03 - Authorization using credit/debit card', () => {});
    it('C04 - Authorization using PIN-code', () => {});
    it('C05 - Authorization for CSMS initiated transactions', () => {});
    it('C06 - Authorization using local id type', () => {})
    it('C07 - Authorization using Contract Certificates', () => {})
    it('C08 - Authorization at EVSE using ISO 15118 External Identification Means (EIM)', () => {})
    it('C09 - Authorization by GroupId', () => {})
    it('C10 - Store Authorization Data in the Authorization Cache', () => {})
    it('C11 - Clear Authorization Data in Authorization Cache', () => {})
    it('C12 - Start Transaction - Cached Id', () => {})
    it('C13 - Offline Authorization through Local Authorization List', () => {})
    it('C14 - Online Authorization through Local Authorization List', () => {})
    it('C15 - Offline Authorization of unknown Id', () => {})
    it('C16 - Stop Transaction with a Master Pass', () => {})
});