export class Services{
  availableService(name: string) {
    cy.get('div')
      .should('contain', name)
      .should('be.visible')
  }
}