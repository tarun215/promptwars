import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LegalAppProvider } from '../context/LegalAppContext';
import { Header } from '../components/Header';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

describe('UI & Accessibility Components', () => {
  it('should render header with navigation tabs and accessible roles', () => {
    render(
      <LegalAppProvider>
        <Header onOpenUpload={() => {}} />
      </LegalAppProvider>
    );

    expect(screen.getByText(/LexiGuard/i)).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
  });

  it('should render compliance disclaimer banner with accessible alert role', () => {
    render(
      <LegalAppProvider>
        <DisclaimerBanner />
      </LegalAppProvider>
    );

    expect(screen.getByText(/Informational Legal Intelligence Assistant/i)).toBeTruthy();
    expect(screen.getByText(/Not Licensed Legal Counsel/i)).toBeTruthy();
  });
});
