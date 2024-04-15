import { faker } from '@faker-js/faker';
describe('Testes relacionados ao cadastro de usuário', () => {
  var fakename = faker.internet.userName()
  var fakeemail = faker.internet.email()
  var login; 

  it('Cadastro realizado com sucesso (senha/e-mail válidos)', () => {
    cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', {
        name: fakename,
        email: fakeemail,
        password: "teste1234",
        })
      .then(function (response){
      expect(response.status).to.equal(201);
      expect(response.body).to.include({
        name: fakename,
        email: fakeemail,
      });
    });
  });
 
  it('Cadastro com e-mail inválidos', () => {
    cy.request({
      method: 'POST',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', 
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

    it('Cadastro com e-mail já cadastrado', () => {
      cy.request({
        method: 'POST',
        url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', 
        body: {
          name: fakename,
          email: "maria@qa.com",
          password: "teste1234",
          }, 
          failOnStatusCode: false
        }).then(function (response) {
          expect(response.status).to.equal(409)
          expect(response.body.error).to.equal('Conflict')
          cy.log(response.body.message)
        })
      });

    it('Cadastro senha inválida (menor do que 6 dígitos)', () => {
      cy.request({
        method: 'POST',
        url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', 
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
      cy.request({
          method: 'POST',
          url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', 
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

    it('Cadastro com pelo menos um dos campos sem preencher (e-mail ou senha)', () => {
      cy.request({
          method: 'POST',
          url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users', 
          body: {
          name: fakename,
          email: null,
          password: "teste12345",
          }, 
          failOnStatusCode: false
        }).then(function (response) {
          expect(response.status).to.equal(400)
                
          cy.log(response.body.message)
        })
    });
})

