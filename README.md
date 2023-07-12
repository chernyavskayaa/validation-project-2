# MyFormComponent Unit Testing

## Test Description

This repository contains MyFormComponent, a React functional component that renders a form and handles form validation. The form captures the user's name, email, agreement to terms, and gender. Form validation is managed within the component, providing feedback to the user for any invalid entries or missing information.

The unit tests for MyFormComponent are written using Jest and the React Testing Library. They ensure that the form behaves as expected under various conditions, including valid and invalid inputs, form submission, and gender selection. The robustness of the email validation is also tested with complex email addresses. Moreover, the tests include scenarios such as submitting the form with the 'Name' field left blank and re-submitting the form after an initial successful submission.

## Running Tests Locally

To run these tests locally, you'll need to have Node.js installed on your computer. Once Node.js is installed, follow the steps below:

1. Clone the repository:
`git clone [<repository-url>](https://github.com/chernyavskayaa/validation-project-2)`

2. Navigate into the project directory:
`cd validation-project-2`

3. Install the project dependencies:
`npm install`

4. Run the project:
`npm start`

5. Run the tests:
`npm test`

By default, create-react-app sets up the testing environment using Jest and React Testing Library. Running npm test starts the test runner in the interactive watch mode. It re-runs the tests as you make changes to the source code, so you can ensure that your changes haven't broken anything.
