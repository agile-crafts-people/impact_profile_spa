describe('Navigation Drawer', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should open navigation drawer with hamburger menu', () => {
    cy.visit('/profiles')
    cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Check that drawer is visible with domain sections
    cy.contains('PROFILE DOMAIN').should('be.exist')
    cy.contains('PLATFORM DOMAIN').should('be.exist')
    cy.contains('USER DOMAIN').should('be.exist')
    cy.contains('IDENTITY DOMAIN').should('be.exist')
  })
  it('should have all profile domain links in drawer', () => {
    cy.visit('/profiles')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-profiles-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-profiles-new-link"]').should('be.visible')
  })
  it('should have all platform domain links in drawer', () => {
    cy.visit('/platforms')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-platforms-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-platforms-new-link"]').should('be.visible')
  })
  it('should have all user domain links in drawer', () => {
    cy.visit('/users')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-users-list-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-users-new-link"]').should('be.visible')
  })
  it('should have identity domain link in drawer', () => {
    cy.visit('/profiles')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-identitys-list-link"]').should('be.visible')
  })

  it('should have admin and logout at bottom of drawer', () => {
    // Login with admin role to see admin link
    cy.login(['admin'])
    cy.visit('/profiles')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    // Admin and Logout should be visible in the drawer
    cy.get('[data-automation-id="nav-admin-link"]').should('be.visible')
    cy.get('[data-automation-id="nav-logout-link"]').should('be.visible')
  })

  it('should navigate to different pages from drawer', () => {
    cy.visit('/profiles')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-s-list-link"]').click()
    cy.url().should('include', '/s')
  })

  it('should close drawer after navigation', () => {
    cy.visit('/profiles')
    cy.get('[data-automation-id="nav-drawer-toggle"]').click()
    
    cy.get('[data-automation-id="nav-s-list-link"]').click()
    
    // Drawer should close after navigation (temporary drawer)
    cy.wait(500)
    cy.contains('PROFILE DOMAIN').should('not.be.visible')
  })
})