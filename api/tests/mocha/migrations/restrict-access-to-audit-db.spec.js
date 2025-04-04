const sinon = require('sinon');
const chai = require('chai');
const request = require('@medic/couch-request');
const environment = require('@medic/environment');
const migration = require('../../../src/migrations/restrict-access-to-audit-db');

describe('restrict-access-to-audit-db', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should create migration with basic properties', () => {
    const expectedCreationDate = new Date(2017, 5, 8).toDateString();

    chai.expect(migration.name).to.equal('restrict-access-to-audit-db');
    chai.expect(migration.created).to.exist;
    chai.expect(migration.created.toDateString()).to.equal(expectedCreationDate);
    chai.expect(migration.run).to.be.a('function');
  });

  it('should request with the right parameters', () => {
    const putStub = sinon.stub(request, 'put').resolves();
    sinon.stub(environment, 'protocol').value('http:');
    sinon.stub(environment, 'host').value('host');
    sinon.stub(environment, 'port').value('port');
    sinon.stub(environment, 'db').returns('database');
    const url = `${environment.protocol}//${environment.host}:${environment.port}/${environment.db}-audit/_security`;
    const auth = {
      username: environment.username,
      password: environment.password
    };
    const body = {
      admins: { names: [], roles: [ 'audit-writer' ] },
      members: { names: [], roles: [ 'audit-writer' ] }
    };

    return migration.run()
      .then(() => {
        chai.expect(putStub.callCount).to.equal(1);
        chai.expect(putStub.args[0][0].url).to.equal(url);
        chai.expect(putStub.args[0][0].auth).to.include(auth);
        chai.expect(putStub.args[0][0].body).to.deep.include(body);
        chai.expect(putStub.args[0][0].json).to.equal(true);
      });
  });

  it('should catch exceptions', () => {
    const putStub = sinon.stub(request, 'put').resolves(Promise.reject('Some Error'));
    const message = 'Failed to add member to audit db."Some Error"';

    return migration
      .run()
      .then(() => chai.assert.fail('should have thrown'))
      .catch((error) => {
        chai.expect(putStub.callCount).to.equal(1);
        chai.expect(error.message).to.equal(message);
      });
  });
});
