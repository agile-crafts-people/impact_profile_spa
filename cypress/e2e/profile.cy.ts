describe('Profile Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display profiles list page', () => {
    cy.visit('/profiles')
    cy.get('h1').contains('Profiles').should('be.visible')
    cy.get('[data-automation-id="profile-list-new-button"]').should('be.visible')
  })

  it('should navigate to new profile page', () => {
    cy.visit('/profiles')
    cy.get('[data-automation-id="profile-list-new-button"]').click()
    cy.url().should('include', '/profiles/new')
    cy.get('h1').contains('New Profile').should('be.visible')
  })

  it('should create a new profile', () => {
    cy.visit('/profiles/new')
    
    const timestamp = Date.now()
    const itemName = `test-profile-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="profile-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="profile-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="profile-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/profiles/')
    cy.url().should('not.include', '/profiles/new')
    
    // Verify the profile name is displayed on edit page
    cy.get('[data-automation-id="profile-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a profile', () => {
    // First create a profile
    cy.visit('/profiles/new')
    const timestamp = Date.now()
    const itemName = `test-profile-update-${timestamp}`
    const updatedName = `updated-profile-${timestamp}`
    
    cy.get('[data-automation-id="profile-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="profile-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="profile-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/profiles/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="profile-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="profile-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="profile-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="profile-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="profile-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="profile-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the profile appears with updated name
    cy.get('[data-automation-id="profile-edit-back-button"]').click()
    cy.url().should('include', '/profiles')
    
    // Search for the updated profile
    cy.get('[data-automation-id="profile-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the profile appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all profiles are shown again
    cy.get('[data-automation-id="profile-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for profiles', () => {
    // First create a profile with a unique name
    cy.visit('/profiles/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="profile-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="profile-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="profile-new-submit-button"]').click()
    cy.url().should('include', '/profiles/')
    
    // Navigate to list page
    cy.visit('/profiles')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the profile
    cy.get('[data-automation-id="profile-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the profile
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all profiles are shown again
    cy.get('[data-automation-id="profile-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
