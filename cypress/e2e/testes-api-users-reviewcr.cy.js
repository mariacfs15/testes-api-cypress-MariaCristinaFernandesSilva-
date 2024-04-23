import { faker } from '@faker-js/faker';
describe('Teste cadastro de review - Bad request', () => {

  it('Cadastro de review não autorizado, usuário sem acesso', () => {
    cy.request({
      method: 'POST',
      url: '/users/review',
      body: {
        'movieId': 0,
        'score': 0,
        'reviewText': "string"
      },
      failOnStatusCode: false,
    }).then(function (response) {
      expect(response.status).to.equal(401);
      expect(response.body).to.include({
        message: "Access denied.",
        error: "Unauthorized",
        statusCode: 401
      })
    });
  });
});


describe('Teste cadastro de review - Sucesso', () => {

  it('Cadastro de review com sucesso', () => {
    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
    var login;
    let token;
    var infoFilme;

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

            //o usuário deve cadastrar um filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Amar',
                genre: 'Romance',
                description: 'Laura e Carlos vivenciam a intensidade e a fragilidade do primeiro amor e veem a realidade da vida abalar suas noções românticas idealizadas.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((dadosFilme) => {
              infoFilme = dadosFilme;

              //o usuário cadastra uma review
              cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                  Authorization: 'Bearer ' + token,
                },
                body: {
                  movieId: infoFilme.body.id,
                  score: 5,
                  reviewText: "string"
                }
              }).then(function (response) {
                expect(response.status).to.equal(201);
                cy.log(response.body)
              });
            });
          });
        });
    });
  });
});


describe('Teste consulta de review - Sucesso', () => {

  it('Consultar Reviews', () => {

    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
    var login;
    let token;
    var infoFilme;

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

            //o usuário deve cadastrar um filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Amar',
                genre: 'Romance',
                description: 'Laura e Carlos vivenciam a intensidade e a fragilidade do primeiro amor e veem a realidade da vida abalar suas noções românticas idealizadas.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((dadosFilme) => {
              infoFilme = dadosFilme;

              //o usuário cadastra uma review
              cy.request({
                method: 'POST',
                url: '/users/review',
                headers: {
                  Authorization: 'Bearer ' + token,
                },
                body: {
                  movieId: infoFilme.body.id,
                  score: 5,
                  reviewText: "string"
                }
              }).then(function (response) {

                cy.request({
                  method: 'GET',
                  url: '/users/review/all',
                  headers: {
                    Authorization: 'Bearer ' + token,
                  },
                }).then((response) => {
                  expect(response.status).to.equal(200);
                });
              });
            });
          });
        });
    });
  });
});

describe('Teste consulta de review - Não existe nenhuma review cadastrada', () => {

  it('Consulta de reviews', () => {

    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
    var login;
    let token;
    var infoFilme;

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

            //o usuário deve cadastrar um filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Amar',
                genre: 'Romance',
                description: 'Laura e Carlos vivenciam a intensidade e a fragilidade do primeiro amor e veem a realidade da vida abalar suas noções românticas idealizadas.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((dadosFilme) => {
              infoFilme = dadosFilme;

               //o usuário não cadastra nenhuma review
                 cy.request({
                  method: 'GET',
                  url: '/users/review/all',
                  headers: {
                    Authorization: 'Bearer ' + token,
                  },
                }).then((response) => {
                  expect(response.status).to.equal(200);
                  cy.log(response.body);
                });
                });
              });
            });
          });
        });
    });
 
