import { faker } from '@faker-js/faker';
describe('Testes relacionados à autenticação do usuário', () => {

//Inicialmente o login deve ser executado com sucesso

  var fakename = faker.internet.userName()
  var fakeemail = faker.internet.email()
  var login; 
  let token;

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


  it('Login com sucesso e-mail e/ou senha válidos)', () => {
    cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login', {
        email: fakeemail,
        password: "teste1234",
        })
      .then(function (login){
      expect(login.status).to.equal(200);
      cy.log(login.body.accessToken);
    });
  });

  it('Login sem sucesso e-mail e/ou senha inválidos)', () => {
    cy.request({
      method: 'POST',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login', 
      body: {
      email: "maria@eemail.com",
      password: "teste12345",
      }, 
      failOnStatusCode: false
    }).then(function (login){
      expect(login.status).to.equal(401);
      cy.log(login.body.message);
    });
  });

  it('Login sem preencher todos os campos)', () => {
    cy.request({
      method: 'POST',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login', 
      body: {
      email: null,
      password: "teste12345",
      }, 
      failOnStatusCode: false
    }).then(function (login){
      expect(login.status).to.equal(400);
      cy.log(login.body.message);
    });
  });
})


