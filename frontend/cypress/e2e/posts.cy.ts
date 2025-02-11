describe('Posts Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('/')
    cy.get('[data-test="login-link"]').click()
    cy.get('[data-test="email-input"]').type('test@example.com')
    cy.get('[data-test="password-input"]').type('password123')
    cy.get('[data-test="login-button"]').click()
  })

  it('should create a new post', () => {
    cy.get('[data-test="create-post-button"]').click()
    cy.get('[data-test="post-title-input"]').type('Test Post')
    cy.get('[data-test="post-content-input"]').type('This is a test post content')
    cy.get('[data-test="submit-post-button"]').click()
    cy.get('[data-test="post-list"]').should('contain', 'Test Post')
  })

  it('should edit an existing post', () => {
    cy.get('[data-test="post-item"]').first().within(() => {
      cy.get('[data-test="edit-post-button"]').click()
    })
    cy.get('[data-test="post-title-input"]').clear().type('Updated Post Title')
    cy.get('[data-test="post-content-input"]').clear().type('Updated post content')
    cy.get('[data-test="update-post-button"]').click()
    cy.get('[data-test="post-list"]').should('contain', 'Updated Post Title')
  })

  it('should delete a post', () => {
    cy.get('[data-test="post-item"]').first().within(() => {
      cy.get('[data-test="delete-post-button"]').click()
    })
    cy.get('[data-test="confirm-delete-button"]').click()
    cy.get('[data-test="post-list"]').should('not.contain', 'Updated Post Title')
  })

  it('should paginate through posts', () => {
    cy.get('[data-test="next-page"]').click()
    cy.url().should('include', 'page=2')
    cy.get('[data-test="prev-page"]').click()
    cy.url().should('include', 'page=1')
  })
})
