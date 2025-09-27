import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('should render input with default props', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md');
  });

  it('should render input with placeholder', () => {
    render(<Input placeholder="Enter your name" />);
    
    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
  });

  it('should render input with value', () => {
    render(<Input defaultValue="John Doe" />);
    
    const input = screen.getByDisplayValue('John Doe');
    expect(input).toBeInTheDocument();
  });

  it('should render different input types', () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');

    rerender(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input-class');
    expect(input).toHaveClass('flex', 'h-10'); // Should still have base classes
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('should accept and forward HTML input attributes', () => {
    render(
      <Input 
        id="test-input"
        name="username"
        required
        maxLength={50}
        data-testid="custom-input"
        aria-label="Username input"
      />
    );
    
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('aria-label', 'Username input');
  });

  it('should handle user input correctly', async () => {
    const user = userEvent.setup();
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  it('should handle controlled input with value prop', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<Input value="initial" onChange={handleChange} />);
    
    const input = screen.getByDisplayValue('initial');
    await user.clear(input);
    await user.type(input, 'new value');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should render with proper focus styles', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
  });

  it('should render with file input type', () => {
    render(<Input type="file" />);
    
    const input = screen.getByRole('button'); // File inputs are rendered as buttons
    expect(input).toHaveClass('file:border-0', 'file:bg-transparent');
  });

  it('should render with proper placeholder styling', () => {
    render(<Input placeholder="Enter text here" />);
    
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toHaveClass('placeholder:text-muted-foreground');
  });
});
