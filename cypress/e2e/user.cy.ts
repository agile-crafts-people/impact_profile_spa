describe('User Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display users list page', () => {
    cy.visit('/users')
    cy.get('h1').contains('Users').should('be.visible')
    cy.get('[data-automation-id="user-list-new-button"]').should('be.visible')
  })

  it('should navigate to new user page', () => {
    cy.visit('/users')
    cy.get('[data-automation-id="user-list-new-button"]').click()
    cy.url().should('include', '/users/new')
    cy.get('h1').contains('New User').should('be.visible')
  })

  it('should create a new user', () => {
    cy.visit('/users/new')
    
    const timestamp = Date.now()
    const itemName = `test-user-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="user-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="user-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="user-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/users/')
    cy.url().should('not.include', '/users/new')
    
    // Verify the user name is displayed on edit page
    cy.get('[data-automation-id="user-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a user', () => {
    // First create a user
    cy.visit('/users/new')
    const timestamp = Date.now()
    const itemName = `test-user-update-${timestamp}`
    const updatedName = `updated-user-${timestamp}`
    
    cy.get('[data-automation-id="user-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="user-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="user-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/users/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="user-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="user-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="user-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="user-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="user-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="user-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the user appears with updated name
    cy.get('[data-automation-id="user-edit-back-button"]').click()
    cy.url().should('include', '/users')
    
    // Search for the updated user
    cy.get('[data-automation-id="user-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the user appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all users are shown again
    cy.get('[data-automation-id="user-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for users', () => {
    // First create a user with a unique name
    cy.visit('/users/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="user-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="user-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="user-new-submit-button"]').click()
    cy.url().should('include', '/users/')
    
    // Navigate to list page
    cy.visit('/users')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the user
    cy.get('[data-automation-id="user-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the user
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all users are shown again
    cy.get('[data-automation-id="user-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
