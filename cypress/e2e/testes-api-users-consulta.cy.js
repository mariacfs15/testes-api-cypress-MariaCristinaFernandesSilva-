import { faker } from '@faker-js/faker';
describe('Testes relacionados à consulta do usuário', () => {

//Inicialmente o cadastro deve ser executado com sucesso

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


//O usuário deve conseguir logar com sucesso   
  it('Login com sucesso e-mail e/ou senha válidos)', () => {
    cy.request('POST', 'https://raromdb-3c39614e42d4.herokuapp.com/api/auth/login', {
        email: fakeemail,
        password: "teste1234",
        })
      .then(function (login){
      expect(login.status).to.equal(200);
      cy.log(login.body.accessToken);
      token = login.body.accessToken
    });
  });
 
//O usuário deve se tornar um Administrador 
   it('Promover usuário a Admin', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users/admin', 
      headers: {
          Authorization: 'Bearer ' + token,
      }, 
    }).then(function (UsuarioAdmin){
      expect(UsuarioAdmin.status).to.equal(204);
      cy.log(UsuarioAdmin.body.message);
    });
  });

  it('O usuário consegue consultar informações de usuário', () => {
    cy.request({
      method: 'GET',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users/2', 
      headers: {
          Authorization: 'Bearer ' + token,
      }, 
    }).then(function (response){
      expect(response.status).to.equal(200);
      cy.log(response.body);
    });
  });

  it('O usuário NÃO consegue consultar informações de usuário (Falta autenticação)', () => {
    cy.request({
      method: 'GET',
      url: 'https://raromdb-3c39614e42d4.herokuapp.com/api/users/2', 
      body: {
        id: 2,
        }, 
        failOnStatusCode: false
      }).then(function (response){
      expect(response.status).to.equal(401);
      expect(response.body).to.include({
        message: "Access denied.",
        error: "Unauthorized",
        statusCode: 401
      })
    });
  });

})

