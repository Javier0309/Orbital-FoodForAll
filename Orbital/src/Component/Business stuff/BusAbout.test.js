import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import BusAbout from './BusAbout';

// Optional: Mock BusHeader if it does complex things
jest.mock('./BusHeader', () => () => <div data-testid="bus-header" />);

describe('BusAbout', () => {
  it('renders header and about text', () => {
    render(<BusAbout />);
    // Check if header exists
    expect(screen.getByTestId('bus-header')).to.exist;
    // Check if "About Us" title exists
    expect(screen.getByText(/About Us/i)).to.exist;
    // Check for main about text
    expect(screen.getByText(/fighting hunger and reducing food waste/i)).to.exist;
    // Check if logo image is present
    expect(screen.getByAltText(/Food For All Logo/i)).to.exist;
  });
});