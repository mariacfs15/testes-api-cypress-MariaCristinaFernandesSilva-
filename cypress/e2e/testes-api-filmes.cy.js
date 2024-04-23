import { faker } from '@faker-js/faker';
describe('Testes relacionados a criação de filmes', () => {
  
  it('Criar filmes', function () {
    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
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

            //o usuário cria o filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Velozes e Furiosos 7',
                genre: 'Ação/Crime',
                description: 'Velozes e Furiosos 7 acompanha Dom (Vin Diesel), Brian (Paul Walker), Letty (Michelle Rodriguez) e o resto da equipe após os acontecimentos em Londres.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((response) => {
              expect(response.status).to.equal(201);
              expect(response.body).to.have.property('id');
              expect(response.body).to.have.property('title');
              expect(response.body).to.have.property('description');
              expect(response.body).to.have.property('genre');
              expect(response.body).to.have.property('durationInMinutes');
              expect(response.body).to.have.property('releaseYear');
              
            });
          });
        });
    });
  });
});


describe('Criação de filmes - Bad request', () => {

  it('Cadastro de review não autorizado, usuário sem acesso', function () {
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


describe('Testes relacionados a consulta de filmes', () => {

  it('Listar Filmes', () => {
    cy.request('GET', '/movies?sort=true').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });


  it('Consulta de um filme utilizando o id', () => {
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

            //o usuário cria o filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Velozes e Furiosos 7',
                genre: 'Ação/Crime',
                description: 'Velozes e Furiosos 7 acompanha Dom (Vin Diesel), Brian (Paul Walker), Letty (Michelle Rodriguez) e o resto da equipe após os acontecimentos em Londres.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((dadosFilme) => {
              infoFilme = dadosFilme;
              cy.log(infoFilme)

              //o usuário consulta o filme
              cy.request({
                method: 'GET',
                url: '/movies/' + infoFilme.body.id,
                body: {
                  id: infoFilme.body.id
                }
              }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('id');
                expect(response.body).to.have.property('title');
                expect(response.body).to.have.property('description');
                expect(response.body).to.have.property('genre');
                expect(response.body).to.have.property('reviews');
                expect(response.body).to.have.property('durationInMinutes');
                expect(response.body).to.have.property('releaseYear');
                expect(response.body).to.have.property('criticScore');
                expect(response.body).to.have.property('audienceScore');
              });
            });
          });
        });
    });
  });


  it('Consulta de um filme utilizando o nome dele', () => {
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

            //o usuário cria o filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Velozes e Furiosos 7',
                genre: 'Ação/Crime',
                description: 'Velozes e Furiosos 7 acompanha Dom (Vin Diesel), Brian (Paul Walker), Letty (Michelle Rodriguez) e o resto da equipe após os acontecimentos em Londres.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((dadosFilme) => {
              infoFilme = dadosFilme;
              cy.log(infoFilme)

              cy.request({
                method: 'GET',
                url: '/movies/search?title=' + infoFilme.body.title,
                body: {
                  title: infoFilme.body.title
                }
              }).then((response) => {
                expect(response.status).to.equal(200);
              });
            });
          });
        });
    });
  });
});


describe('Testes relacionados a atualização de filmes', () => {

  it('Atualizar os filmes', () => {
    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
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

            //o usuário cria o filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Velozes e Furiosos 7',
                genre: 'Ação/Crime',
                description: 'Velozes e Furiosos 7 acompanha Dom (Vin Diesel), Brian (Paul Walker), Letty (Michelle Rodriguez) e o resto da equipe após os acontecimentos em Londres.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((dadosFilme) => {
              infoFilme = dadosFilme;

              //o usuário atualiza o filme 
              cy.request({
                method: 'PUT',
                url: '/movies/' + infoFilme.body.id,
                body: {
                  id: infoFilme.body.id,
                  title: "A cabana",
                  genre: "string",
                  description: "string",
                  durationInMinutes: 50,
                  releaseYear: 15
                },
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              }).then((response) => {
                expect(response.status).to.equal(204);
              });
            });
          });
        });
    });
  });
});


describe('Testes relacionados a exclusão de filmes', () => {

  it('Exclusão de filmes', () => {
    var infoUsuario;
    var fakename = faker.internet.userName()
    var fakeemail = faker.internet.email()
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

            //o usuário cria o filme 
            cy.request({
              method: 'POST',
              url: '/movies',
              body: {
                title: 'Sem rastros',
                genre: 'Aventura',
                description: 'Pai e filha vivem isolados em um parque florestal, até que as autoridades tomam a decisão controversa de reintegrá-los à sociedade.',
                durationInMinutes: 120,
                releaseYear: 15,
              },
              headers: {
                Authorization: 'Bearer ' + token,
              },
            }).then((dadosFilme) => {
              infoFilme = dadosFilme;

              //o usuário exclui o filme 
              cy.request({
                method: 'DELETE',
                url: '/movies/' + infoFilme.body.id,
                body: {
                  id: infoFilme.body.id,
                },
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              }).then((response) => {
                expect(response.status).to.equal(204);
              });
            });
          });
        });
    });
  });
});
