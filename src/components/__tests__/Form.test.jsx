import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyFormComponent from '../Form';

const name = 'John Doe';
const email = 'johndoe@gmail.com';

const nameErrorMessage = 'Name must be at least 3 characters.';
const emailErrorMessage = 'Email must be valid.';
const agreeTermsErrorMessage = 'You must agree to the terms.';
const genderErrorMessage = 'You must select a gender.';

const getName = () => screen.getByPlaceholderText('Name');
const getEmail = () => screen.getByPlaceholderText('Email');
const getAgreeTerms = () => screen.getAllByRole('checkbox').find((input) => input.name === 'agreeTerms');
const getMaleGender = () => screen.getAllByRole('radio').find((input) => input.name === 'gender');
const getFemaleGender = () =>
  screen
    .getAllByRole('radio')
    .reverse()
    .find((input) => input.name === 'gender');

const getSubmitButton = () => screen.getByRole('button', { name: /submit/i });

describe('MyFormComponent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation((value) => value);
  });
  it('successful pass: submits the form with all fields filled correctly', () => {
    render(<MyFormComponent />);

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), email);

    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(screen.getByText(/submit/i));

    expect(screen.queryByText(nameErrorMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(emailErrorMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(agreeTermsErrorMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(genderErrorMessage)).not.toBeInTheDocument();

    expect(console.log).toHaveBeenCalledWith({
      name,
      email,
      agreeTerms: true,
      gender: 'male',
    });
  });

  it('successful pass: handles very long names correctly', () => {
    const longName = 'a'.repeat(1000);

    render(<MyFormComponent />);

    userEvent.type(getName(), longName);
    userEvent.type(getEmail(), email);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.queryByText(nameErrorMessage)).not.toBeInTheDocument();

    expect(console.log).toHaveBeenCalledWith({
      name: longName,
      email,
      agreeTerms: true,
      gender: 'male',
    });
  });

  it('successful pass: handles complex valid email addresses correctly', () => {
    const complexEmail = 'test.name+alias@example.co.uk';

    render(<MyFormComponent />);

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), complexEmail);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.queryByText(emailErrorMessage)).not.toBeInTheDocument();

    expect(console.log).toHaveBeenCalledWith({
      name,
      email: complexEmail,
      agreeTerms: true,
      gender: 'male',
    });
  });

  it('successful pass: changes gender from male to female and submits correctly', () => {
    render(<MyFormComponent />);

    console.log(screen.getAllByRole('radio', screen.getAllByRole('radio')));

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), email);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(getFemaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.queryByText(genderErrorMessage)).not.toBeInTheDocument();

    expect(console.log).toHaveBeenCalledWith({
      name,
      email,
      agreeTerms: true,
      gender: 'female',
    });
  });

  it('successful pass: resubmits the form after initial successful submission', async () => {
    render(<MyFormComponent />);

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), email);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.queryByText(genderErrorMessage)).not.toBeInTheDocument();

    expect(console.log).toHaveBeenCalledWith({
      name,
      email,
      agreeTerms: true,
      gender: 'male',
    });

    userEvent.clear(getName());
    userEvent.clear(getEmail());
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), email);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getFemaleGender());
    fireEvent.click(getSubmitButton());

    expect(console.log).toHaveBeenCalledWith({
      name,
      email,
      agreeTerms: true,
      gender: 'female',
    });
  });

  it('negative pass: submits the form with the "Name" field left blank', () => {
    const email = 'test@example.com';

    render(<MyFormComponent />);

    userEvent.type(getEmail(), email);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.getByText(nameErrorMessage)).toBeInTheDocument();
  });

  it('negative pass: submits the form with invalid Email field', () => {
    const invalidEmail = 'testexample.com';

    render(<MyFormComponent />);

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), invalidEmail);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.getByText(emailErrorMessage)).toBeInTheDocument();
  });

  it('negative pass: submits the form without checking "Agree to terms" checkbox', () => {
    render(<MyFormComponent />);

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), email);
    fireEvent.click(getMaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.getByText(agreeTermsErrorMessage)).toBeInTheDocument();
  });
  it('negative pass: submits the form without selecting a gender', () => {
    render(<MyFormComponent />);

    userEvent.type(getName(), name);
    userEvent.type(getEmail(), email);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getSubmitButton());

    expect(screen.getByText(genderErrorMessage)).toBeInTheDocument();
  });

  it('negative pass: submits the form with name length less than 3 characters', () => {
    const shortName = 'Jo';
    render(<MyFormComponent />);

    userEvent.type(getName(), shortName);
    userEvent.type(getEmail(), email);
    fireEvent.click(getAgreeTerms());
    fireEvent.click(getMaleGender());
    fireEvent.click(getSubmitButton());

    expect(screen.getByText(nameErrorMessage)).toBeInTheDocument();
  });
});
