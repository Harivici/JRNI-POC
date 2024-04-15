/// <reference types="cypress" />
import { Services } from "../pom/Services"

const service = new Services

describe('JRNI - Appointment spec', () => {

  it('JRNI landing page', () => {

    cy.fixture('example').then((data) => {
      const companyId = data.companyId
      const companyName = data.companyName
     
    console.log('companyId', companyId)
    cy.visit('http://localhost:3001/')

    cy.get('h1').should('contain', `Welcome to ${companyName}(${companyId}) JRNI appointments/services`)
    cy.contains('h1', `Welcome to ${companyName}(${companyId}) JRNI appointments/services`)

    cy.get('button')
      .should('contain', '1.Display services')
      .should('be.visible')
      .should('be.enabled')
    cy.contains('1.Display services').click()

    // cy.get('div')
    //   .should('contain', 'Handsfree service')
    //   .should('be.visible')
  
    cy.wait(3000)
    if (companyId === 37009) {
      service.availableService('Handsfree service')
      service.availableService('Butler 1 hour')
      service.availableService('Butler 2 hour')
      service.availableService('Gold stylist package')
      service.availableService('Silver stylist package')
      service.availableService('QVB 15m test')

      cy.contains('Handsfree service').click()
    }

    if (companyId === 37031) {
      service.availableService('Scooter Rentals 2 Hrs')
      service.availableService('Scooter Rentals 1 Hr')
      
      cy.contains('Scooter Rentals 2 Hrs').click()
    }

    if (companyId === 37007) {
      service.availableService('Mortgage Advice')
      service.availableService('Open an Account')
      service.availableService('Dress Fitting')
      service.availableService('Test Service')
      service.availableService('Personal Shopper')
      cy.contains('Dress Fitting').click()
    }

    // cy.get('input').clear()
    //   .type('hk.sudda@gmail.com')

    // cy.intercept({
    //   method: 'GET', 
    //   url: 'https://vicinity-demo.jrni.com/api/v5/37009/times?service_id=48427&start_date=2024-04-04T02:35:28.491Z&end_date=2024-04-07&time_zone=Australia/Melbourne&only_available=true&duration=60',
    //   headers: {
    //     'App-Id': '78c3c238a140b36865ea53bebbf483d8c60a7dcd57b2'
    //   }
    // // }).as('times')
    // //   // cy.wait(6000)
    // //   // cy.wait('@times')
    // //   const times = cy.get('times')
    // //   console.log(times)
    //  }, { fixture: 'times' })
    
    cy.wait(2000)
    // cy.fixture('times').then((data) => {
    //   cy.log(data)
    //  })
    
    cy.get('#Sunday')
    .select([1])
    .invoke('val')
    
    // .should('eq', '2024-04-07T10:00:00+10:00')

    cy.contains('4.Add time slot into Basket').click()

    cy.wait(1000)

    cy.contains('Proceed to Client Details').click()

    cy.wait(2000)

    cy.get('#firstName').type('Hari')
    cy.get('#lastName').type('Suddpalli')
    cy.get('#email').type('harikrishna.suddapalli@vicinity.com.au')
    cy.get('#mobile').type('0432023177')
    cy.contains('5.Add Client Details to Basket').click()

    cy.wait(1000)

    cy.contains('6.Book Now').click()
    cy.wait(2000)

    cy.get('.ConfirmContainer > h1').should('contain','Well done.')

  })

    // expect(true).to.be.true
    // assert.equal(4,4)
  
})
})
