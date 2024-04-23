import { faker } from '@faker-js/faker';
describe('Testes autenticação do usuário - Sucesso', () => {

  it('Login com sucesso e-mail e senha válidos', function () {
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()

    //Criação de usuário
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    }).then(() => {

      //Tentativa de login
      cy.request('POST', '/auth/login', {
        email: fakeemail,
        password: "teste1234",
      }).then(function (login) {
        expect(login.status).to.equal(200);
        cy.log(login.body.accessToken);
      });
    });
  });
})

describe('Testes autenticação do usuário - Bad requests', () => {
 
  it('Login sem sucesso - e-mail inválido', function () {
    //Tentativa de login
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: "maria",
        password: "teste12345",
      },
      failOnStatusCode: false
    }).then(function (login) {
      expect(login.status).to.equal(400);
      cy.log(login.body.message);
    });
  });

  it('Login sem sucesso - senha inválida', function () {
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()

    //Criação de usuário
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste56g",
    }).then(() => {

      //Tentativa de login
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: fakeemail,
          password: "teste12345",
        },
        failOnStatusCode: false
      }).then(function (login) {
        expect(login.status).to.equal(401);
        cy.log(login.body.message);
      });
    });
  });

  it('Login sem preencher o campo e-mail)', function () {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: {
        email: null,
        password: "teste12345",
      },
      failOnStatusCode: false
    }).then(function (login) {
      expect(login.status).to.equal(400);
      cy.log(login.body.message);
    });
  });

  it('Login sem preencher o campo senha)', function () {
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()

    //Criação de usuário
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste56g",
    }).then(() => {

      //Tentativa de login
      cy.request({
        method: 'POST',
        url: '/auth/login',
        body: {
          email: fakeemail,
          password: null,
        },
        failOnStatusCode: false
      }).then(function (login) {
        expect(login.status).to.equal(400);
        cy.log(login.body.message);
      });
    });
  });
});

describe('Tornar usuário Admin', () => {

  var fakename = faker.internet.userName()
  var fakeemail = faker.internet.email()
  let token;

  it('Promover usuário a Admin', () => {
    //Inicialmente o cadastro deve ser executado com sucesso
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    })

    //O usuário deve conseguir logar com sucesso   
    cy.request('POST', '/auth/login', {
      email: fakeemail,
      password: "teste1234",
    })
      .then(function (login) {
        cy.log(login.body.accessToken);
        token = login.body.accessToken;
   
    //O usuário deve se tornar um Administrador      
    cy.request({
        method: 'PATCH',
        url: '/users/admin',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }).then(function (UsuarioAdmin) {
        expect(UsuarioAdmin.status).to.equal(204);
        cy.log(UsuarioAdmin.body.message);
      });
    });
  });
});

describe('Tornar usuário Crítico', () => {

  var fakename = faker.internet.userName()
  var fakeemail = faker.internet.email()
  let token;

  it('Promover usuário a Crítico', () => {
    //Inicialmente o cadastro deve ser executado com sucesso
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    })

    //O usuário deve conseguir logar com sucesso   
    cy.request('POST', '/auth/login', {
      email: fakeemail,
      password: "teste1234",
    })
      .then(function (login) {
        cy.log(login.body.accessToken);
        token = login.body.accessToken;
   
    //O usuário deve se tornar um Crítico     
    cy.request({
        method: 'PATCH',
        url: '/users/apply',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }).then(function (UsuarioCritico) {
        expect(UsuarioCritico.status).to.equal(204);
        cy.log(UsuarioCritico.body.message);
      });
    });
  });
});

describe('Tornar usuário Inativo', () => {

  var fakename = faker.internet.userName()
  var fakeemail = faker.internet.email()
  let token;

  it('Inativar a conta do usuário', () => {
    
    //Inicialmente o cadastro deve ser executado com sucesso
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    })

    //O usuário deve conseguir logar com sucesso   
    cy.request('POST', '/auth/login', {
      email: fakeemail,
      password: "teste1234",
    })
      .then(function (login) {
        cy.log(login.body.accessToken);
        token = login.body.accessToken;
   
    //O usuário deve inativar a conta    
    cy.request({
        method: 'PATCH',
        url: '/users/inactivate',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }).then(function (UsuarioInativo) {
        expect(UsuarioInativo.status).to.equal(204);
        cy.log(UsuarioInativo.body.message);
      });
    });
  });
});