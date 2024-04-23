import { faker } from '@faker-js/faker';
describe('Teste cadastro de usuário - sucesso', () => {

  it('Cadastro realizado com sucesso (senha/e-mail válidos)', () => {
    var fakename = faker.internet.userName();
    var fakeemail = faker.internet.email();

    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    })
      .then(function (response) {
        expect(response.status).to.equal(201);
        expect(response.body).to.include({
          name: fakename,
          email: fakeemail,
        });
      });
  });
})

describe('Teste cadastro de usuário - Bad Requests', () => {

    it('Cadastro com e-mail já cadastrado', function () {
      var fakename = faker.internet.userName();
      var fakeemail = faker.internet.email();

      cy.request('POST', '/users', {
        name: fakename,
        email: fakeemail,
        password: "teste1234",
      }).then(() => {

        cy.request({
          method: 'POST',
          url: '/users',
          body: {
            name: fakename,
            email: fakeemail,
            password: "teste1234",
          },
          failOnStatusCode: false,
        }).then(function (response) {
          expect(response.status).to.equal(409)
          expect(response.body.error).to.equal('Conflict')
          cy.log(response.body.message)
        });
      });
    });

    it('Cadastro com e-mail inválidos', () => {
      var fakename = faker.internet.userName();
      var fakeemail = faker.internet.email();

      cy.request({
        method: 'POST',
        url: '/users',
        body: {
          name: fakename,
          email: "email",
          password: "teste1234",
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('Bad Request')
        cy.log(response.body.message)
      })
    });


    it('Cadastro senha inválida (menor do que 6 dígitos)', () => {
      var fakename = faker.internet.userName();
      var fakeemail = faker.internet.email();

      cy.request({
        method: 'POST',
        url: '/users',
        body: {
          name: fakename,
          email: fakeemail,
          password: "teste",
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.equal(400)

        cy.log(response.body.message)
      })
    });

    it('Cadastro senha inválida (maior do que 12 dígitos)', () => {
      var fakename = faker.internet.userName();
      var fakeemail = faker.internet.email();

      cy.request({
        method: 'POST',
        url: '/users',
        body: {
          name: fakename,
          email: fakeemail,
          password: "teste12345656",
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.equal(400)

        cy.log(response.body.message)
      })
    });

    it('Cadastro com e-mail sem preencher', () => {
      var fakename = faker.internet.userName();

      cy.request({
        method: 'POST',
        url: '/users',
        body: {
          name: fakename,
          email: null,
          password: "teste12345",
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.equal(400)

        cy.log(response.body.message)
      });
    });

    it('Cadastro com senha sem preencher', () => {
      var fakename = faker.internet.userName();
      var fakeemail = faker.internet.email();

      cy.request({
        method: 'POST',
        url: '/users',
        body: {
          name: fakename,
          email: fakeemail,
          password: null,
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.equal(400)

        cy.log(response.body.message)
      });
    });

    it('Cadastro com nome sem preencher', () => {
      var fakeemail = faker.internet.email();

      cy.request({
        method: 'POST',
        url: '/users',
        body: {
          name: null,
          email: fakeemail,
          password: "teste1234",
        },
        failOnStatusCode: false
      }).then(function (response) {
        expect(response.status).to.equal(400)

        cy.log(response.body.message)
      });
    });
  });

