describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should allow user to register', () => {
    cy.get('[data-test="register-link"]').click()
    cy.get('[data-test="name-input"]').type('Test User')
    cy.get('[data-test="email-input"]').type('test@example.com')
    cy.get('[data-test="password-input"]').type('password123')
    cy.get('[data-test="password-confirmation-input"]').type('password123')
    cy.get('[data-test="register-button"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should allow user to login', () => {
    cy.get('[data-test="login-link"]').click()
    cy.get('[data-test="email-input"]').type('test@example.com')
    cy.get('[data-test="password-input"]').type('password123')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('should show validation errors', () => {
    cy.get('[data-test="login-link"]').click()
    cy.get('[data-test="login-button"]').click()
    cy.get('[data-test="email-error"]').should('be.visible')
    cy.get('[data-test="password-error"]').should('be.visible')
  })

  it('should allow user to logout', () => {
    // Login first
    cy.get('[data-test="login-link"]').click()
    cy.get('[data-test="email-input"]').type('test@example.com')
    cy.get('[data-test="password-input"]').type('password123')
    cy.get('[data-test="login-button"]').click()
    
    // Then logout
    cy.get('[data-test="user-menu"]').click()
    cy.get('[data-test="logout-button"]').click()
    cy.url().should('include', '/login')
  })
})
