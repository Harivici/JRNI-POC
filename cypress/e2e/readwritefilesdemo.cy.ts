/// <reference types="cypress" />


// before(() => {
//   cy.fixture('example.json').as('test_data')
// })

it('Read files using fixture', () =>  {
  
 cy.fixture('example').then((data) => {
  cy.log(data.name)
  cy.log(data.email)
 })

cy.fixture('example').its('name').should('eq', 'Welcome to JRNI/Appointmetns')
//  cy.log(this.test_data)

})

it('Write file demo', () =>  {
 
  // cy.writeFile('example',{test: 'test'})
  // cy.writeFile('example',{test: 'test123'}, {flag: 'a+'})
 })