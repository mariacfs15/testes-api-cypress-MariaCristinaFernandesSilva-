import { faker } from '@faker-js/faker';
describe('Testes relacionados a consulta de filmes', () => {
  it('Consulta de um filme utilizando o id', () => {
  
    cy.request({
      method: 'GET',
      url: `https://raromdb-3c39614e42d4.herokuapp.com/api/movies/1`, 
      body: {
        id: 1
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

      cy.log(response.body);
    });
  });

  it('Consulta de um filme utilizando o nome', () => {
  
    cy.request({
      method: 'GET',
      url: `https://raromdb-3c39614e42d4.herokuapp.com/api/movies/search?title=vomer%20depopulo%20tamen%20adsum%20neque`, 
      body: {
        title: "vomer depopulo tamen adsum neque"
      }
    }).then((response) => {
      expect(response.status).to.equal(200);
  
      });
  });
});