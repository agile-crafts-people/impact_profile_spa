describe('Platform Domain', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should display platforms list page', () => {
    cy.visit('/platforms')
    cy.get('h1').contains('Platforms').should('be.visible')
    cy.get('[data-automation-id="platform-list-new-button"]').should('be.visible')
  })

  it('should navigate to new platform page', () => {
    cy.visit('/platforms')
    cy.get('[data-automation-id="platform-list-new-button"]').click()
    cy.url().should('include', '/platforms/new')
    cy.get('h1').contains('New Platform').should('be.visible')
  })

  it('should create a new platform', () => {
    cy.visit('/platforms/new')
    
    const timestamp = Date.now()
    const itemName = `test-platform-${timestamp}`
    
    // Use automation IDs for reliable element selection
    cy.get('[data-automation-id="platform-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="platform-new-description-input"]').type('Test description for Cypress')
    cy.get('[data-automation-id="platform-new-submit-button"]').click()
    
    // Should redirect to edit page after creation
    cy.url().should('include', '/platforms/')
    cy.url().should('not.include', '/platforms/new')
    
    // Verify the platform name is displayed on edit page
    cy.get('[data-automation-id="platform-edit-name-input"]').find('input').should('have.value', itemName)
  })

  it('should update a platform', () => {
    // First create a platform
    cy.visit('/platforms/new')
    const timestamp = Date.now()
    const itemName = `test-platform-update-${timestamp}`
    const updatedName = `updated-platform-${timestamp}`
    
    cy.get('[data-automation-id="platform-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="platform-new-description-input"]').type('Original description')
    cy.get('[data-automation-id="platform-new-submit-button"]').click()
    
    // Wait for redirect to edit page
    cy.url().should('include', '/platforms/')
    
    // Update the name field (auto-save on blur)
    cy.get('[data-automation-id="platform-edit-name-input"]').find('input').clear().type(updatedName)
    cy.get('[data-automation-id="platform-edit-name-input"]').find('input').blur()
    
    // Wait for save to complete
    cy.wait(1000)
    
    // Verify the update was saved
    cy.get('[data-automation-id="platform-edit-name-input"]').find('input').should('have.value', updatedName)
    
    // Update description
    cy.get('[data-automation-id="platform-edit-description-input"]').find('textarea').clear().type('Updated description')
    cy.get('[data-automation-id="platform-edit-description-input"]').find('textarea').blur()
    cy.wait(1000)
    
    // Update status
    cy.get('[data-automation-id="platform-edit-status-select"]').click()
    cy.get('.v-list-item').contains('archived').click()
    cy.wait(1000)
    
    // Navigate back to list and verify the platform appears with updated name
    cy.get('[data-automation-id="platform-edit-back-button"]').click()
    cy.url().should('include', '/platforms')
    
    // Search for the updated platform
    cy.get('[data-automation-id="platform-list-search"]').find('input').type(updatedName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the platform appears in the search results
    cy.get('table').should('contain', updatedName)
    
    // Clear search and verify all platforms are shown again
    cy.get('[data-automation-id="platform-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })

  it('should search for platforms', () => {
    // First create a platform with a unique name
    cy.visit('/platforms/new')
    const timestamp = Date.now()
    const itemName = `search-test-${timestamp}`
    
    cy.get('[data-automation-id="platform-new-name-input"]').type(itemName)
    cy.get('[data-automation-id="platform-new-description-input"]').type('Search test description')
    cy.get('[data-automation-id="platform-new-submit-button"]').click()
    cy.url().should('include', '/platforms/')
    
    // Navigate to list page
    cy.visit('/platforms')
    
    // Wait for initial load
    cy.get('table').should('exist')
    
    // Search for the platform
    cy.get('[data-automation-id="platform-list-search"]').find('input').type(itemName)
    // Wait for debounce (300ms) plus API call
    cy.wait(800)
    
    // Verify the search results contain the platform
    cy.get('table tbody').should('contain', itemName)
    
    // Clear search and verify all platforms are shown again
    cy.get('[data-automation-id="platform-list-search"]').find('input').clear()
    cy.wait(800)
    cy.get('table').should('exist')
  })
})
