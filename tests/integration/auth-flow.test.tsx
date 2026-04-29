import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import { signupUser, getSession } from '@/lib/storage';

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe('test@example.com');
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();
    // Pre-create the user
    signupUser('existing@example.com', 'pass123');
    localStorage.setItem('habit-tracker-session', 'null');

    render(<SignupForm />);
    await user.type(screen.getByTestId('auth-signup-email'), 'existing@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'newpass');
    await user.click(screen.getByTestId('auth-signup-submit'));

    expect(await screen.findByText('User already exists')).toBeInTheDocument();
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();
    // Pre-create user
    signupUser('login@example.com', 'mypassword');
    localStorage.setItem('habit-tracker-session', 'null');

    render(<LoginForm />);
    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'mypassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    const session = getSession();
    expect(session?.email).toBe('login@example.com');
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpass');
    await user.click(screen.getByTestId('auth-login-submit'));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
});
