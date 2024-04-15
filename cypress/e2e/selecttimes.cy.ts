/// <reference types="cypress" />
// import { Select } from "../pom/selecttime"

// const select = new Select

// it('Select time from dropdown', () => {
//   cy.intercept({
//     method: 'GET',
//     url: 'https://vicinity-demo.jrni.com/api/v5/37009/times?service_id=48427&start_date=2024-04-04T02:35:28.491Z&end_date=2024-04-07&time_zone=Australia/Melbourne&only_available=true&duration=60',
//       headers: {
//         'App-Id': '78c3c238a140b36865ea53bebbf483d8c60a7dcd57b2'
//       }
//   }).as('apiCheck')
  
//   cy.visit('http://localhost:3001/')
  
//   cy.wait('@apiCheck').then((interception) => {
//     assert.isNotNull(interception?.response?.body, '1st API call has data')
//   })

  

//   cy.wait('@apiCheck').then((interception) => {
//     assert.isNotNull(interception?.response?.body, '2nd API call has data')
//   })
  
//   cy.wait('@apiCheck').then((interception) => {
//     assert.isNotNull(interception?.response?.body, '3rd API call has data')
//   })
  
//   cy.visit('http://localhost:3001/')
//   select.test()
  
// })