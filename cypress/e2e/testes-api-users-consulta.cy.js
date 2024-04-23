import { faker } from '@faker-js/faker';
describe('Testes relacionado à consulta do usuário - sucesso', () => {

  it('Consultar informações de usuário utilizando ID', () => {
    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
    var login;
    let token;

    //Inicialmente o cadastro deve ser executado com sucesso
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    }).then((informacoes) => {
      infoUsuario = informacoes;

      //O usuário deve conseguir logar com sucesso   
      cy.request('POST', '/auth/login', {
        email: fakeemail,
        password: "teste1234",
      })
        .then(function (login) {
          cy.log(login.body.accessToken);
          token = login.body.accessToken

          //O usuário deve se tornar um Administrador   
          cy.request({
            method: 'PATCH',
            url: '/users/admin',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }).then(function (UsuarioAdmin) {
            expect(UsuarioAdmin.status).to.equal(204)

            //o usuário consulta as informações de um usuário
            cy.log(infoUsuario)
            cy.request({
              method: 'GET',
              url: '/users/' + infoUsuario.body.id,
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then(function (response) {
              expect(response.status).to.equal(200);
              cy.log(response.body)
            });
          });
        });
    });
  })

  it('Consultar lista de usuário', () => {
    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
    var login;
    let token;

    //Inicialmente o cadastro deve ser executado com sucesso
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    }).then((informacoes) => {
      infoUsuario = informacoes;

      //O usuário deve conseguir logar com sucesso   
      cy.request('POST', '/auth/login', {
        email: fakeemail,
        password: "teste1234",
      })
        .then(function (login) {
          cy.log(login.body.accessToken);
          token = login.body.accessToken

          //O usuário deve se tornar um Administrador   
          cy.request({
            method: 'PATCH',
            url: '/users/admin',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }).then(function (UsuarioAdmin) {
            expect(UsuarioAdmin.status).to.equal(204)

            //o usuário consulta a lista de usuários
            cy.request({
              method: 'GET',
              url: '/users',
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then(function (response) {
              expect(response.status).to.equal(200);
              expect(response.body).to.be.an('array');
            });
          });
        });
    });
  })
})

describe('Testes relacionado à consulta do usuário - Bad request', () => {
  it('O usuário NÃO consegue consultar informações de usuário - (Falta autenticação/Usuário sem permissão)', () => {
    cy.request({
      method: 'GET',
      url: '/users/2',
      body: {
        id: 2,
      },
      failOnStatusCode: false
    }).then(function (response) {
      expect(response.status).to.equal(401);
      expect(response.body).to.include({
        message: "Access denied.",
        error: "Unauthorized",
        statusCode: 401
      })
    });
  });

  
  //A API retorna o mesmo status 200, mesmo que o usuário não seja encontrado na lista, o esperado era que ele retornasse uma BAD REQUEST
  it('Consultar usuário de ID não existente', () => {
    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
    var login;
    let token;

    //Inicialmente o cadastro deve ser executado com sucesso
    cy.request('POST', '/users', {
      name: fakename,
      email: fakeemail,
      password: "teste1234",
    }).then((informacoes) => {
      infoUsuario = informacoes;

      //O usuário deve conseguir logar com sucesso   
      cy.request('POST', '/auth/login', {
        email: fakeemail,
        password: "teste1234",
      })
        .then(function (login) {
          cy.log(login.body.accessToken);
          token = login.body.accessToken

          //O usuário deve se tornar um Administrador   
          cy.request({
            method: 'PATCH',
            url: '/users/admin',
            headers: {
              Authorization: 'Bearer ' + token,
            },
          }).then(function (UsuarioAdmin) {
            expect(UsuarioAdmin.status).to.equal(204)

            //o usuário consulta as informações de um usuário
            
            cy.request({
              method: 'GET',
              url: '/users/2301923910823918293018029381092830182093810923810923' ,
              headers: {
                Authorization: 'Bearer ' + token,
              }, failOnStatusCode: false
            }).then(function (response) {
              expect(response.status).to.equal(200);
              cy.log(response.body)
            });
          });
        });
    });
  })

});








