import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventForm } from '../../../src/components/admin/events/event-form'

// Mock dos ícones do Lucide
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon" />,
  MapPin: () => <div data-testid="mappin-icon" />,
  Users: () => <div data-testid="users-icon" />,
  FileText: () => <div data-testid="filetext-icon" />,
  Save: () => <div data-testid="save-icon" />,
  X: () => <div data-testid="x-icon" />
}))

describe('EventForm Component', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    loading: false
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render new event form correctly', () => {
      render(<EventForm {...defaultProps} />)

      expect(screen.getByText('Novo Evento')).toBeInTheDocument()
      expect(screen.getByLabelText('Título do Evento *')).toBeInTheDocument()
      expect(screen.getByLabelText('Data de Início *')).toBeInTheDocument()
      expect(screen.getByLabelText('Horário de Início *')).toBeInTheDocument()
      expect(screen.getByLabelText('Data de Fim (opcional)')).toBeInTheDocument()
      expect(screen.getByLabelText('Horário de Fim (opcional)')).toBeInTheDocument()
      expect(screen.getByLabelText('Localização')).toBeInTheDocument()
      expect(screen.getByLabelText('Capacidade (opcional)')).toBeInTheDocument()
      expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
      expect(screen.getByText('Evento público (visível no site)')).toBeInTheDocument()
    })

    it('should render edit event form when initialData is provided', () => {
      const initialData = {
        title: 'Existing Event',
        description: 'Event description',
        startDate: '2024-01-15',
        startTime: '10:00'
      }

      render(<EventForm {...defaultProps} initialData={initialData} />)

      expect(screen.getByText('Editar Evento')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Existing Event')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Event description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10:00')).toBeInTheDocument()
    })

    it('should show loading state when loading prop is true', () => {
      render(<EventForm {...defaultProps} loading={true} />)

      const submitButton = screen.getByRole('button', { name: /salvando/i })
      expect(submitButton).toBeDisabled()
    })

    it('should render all icons correctly', () => {
      render(<EventForm {...defaultProps} />)

      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
      expect(screen.getByTestId('mappin-icon')).toBeInTheDocument()
      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
      expect(screen.getByTestId('filetext-icon')).toBeInTheDocument()
      expect(screen.getByTestId('save-icon')).toBeInTheDocument()
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })
  })

  describe('Form Interactions', () => {
    it('should update form fields when user types', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      const titleInput = screen.getByLabelText('Título do Evento *')
      const descriptionInput = screen.getByLabelText('Descrição')

      await user.type(titleInput, 'Test Event')
      await user.type(descriptionInput, 'Test Description')

      expect(titleInput).toHaveValue('Test Event')
      expect(descriptionInput).toHaveValue('Test Description')
    })

    it('should toggle public checkbox', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      const publicCheckbox = screen.getByLabelText('Evento público (visível no site)')
      
      // Checkbox should be checked by default
      expect(publicCheckbox).toBeChecked()

      await user.click(publicCheckbox)
      expect(publicCheckbox).not.toBeChecked()

      await user.click(publicCheckbox)
      expect(publicCheckbox).toBeChecked()
    })

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when X button is clicked', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      const xButton = screen.getByRole('button', { name: '' }) // X button has no text
      await user.click(xButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /salvar evento/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Título é obrigatório')).toBeInTheDocument()
        expect(screen.getByText('Data de início é obrigatória')).toBeInTheDocument()
        expect(screen.getByText('Horário de início é obrigatório')).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should validate capacity field as number', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      const titleInput = screen.getByLabelText('Título do Evento *')
      const startDateInput = screen.getByLabelText('Data de Início *')
      const startTimeInput = screen.getByLabelText('Horário de Início *')
      const capacityInput = screen.getByLabelText('Capacidade (opcional)')

      await user.type(titleInput, 'Test Event')
      await user.type(startDateInput, '2024-01-15')
      await user.type(startTimeInput, '10:00')
      await user.type(capacityInput, 'invalid')

      const submitButton = screen.getByRole('button', { name: /salvar evento/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Capacidade deve ser um número')).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should clear validation errors when user starts typing', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /salvar evento/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Título é obrigatório')).toBeInTheDocument()
      })

      // Start typing in title field
      const titleInput = screen.getByLabelText('Título do Evento *')
      await user.type(titleInput, 'T')

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText('Título é obrigatório')).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      // Fill required fields
      await user.type(screen.getByLabelText('Título do Evento *'), 'Test Event')
      await user.type(screen.getByLabelText('Data de Início *'), '2024-01-15')
      await user.type(screen.getByLabelText('Horário de Início *'), '10:00')
      await user.type(screen.getByLabelText('Localização'), 'Test Location')
      await user.type(screen.getByLabelText('Capacidade (opcional)'), '50')
      await user.type(screen.getByLabelText('Descrição'), 'Test Description')

      const submitButton = screen.getByRole('button', { name: /salvar evento/i })
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Event',
        description: 'Test Description',
        startDate: '2024-01-15',
        startTime: '10:00',
        endDate: '',
        endTime: '',
        location: 'Test Location',
        capacity: '50',
        isPublic: true
      })
    })

    it('should submit form with minimal required data', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      // Fill only required fields
      await user.type(screen.getByLabelText('Título do Evento *'), 'Minimal Event')
      await user.type(screen.getByLabelText('Data de Início *'), '2024-01-15')
      await user.type(screen.getByLabelText('Horário de Início *'), '10:00')

      const submitButton = screen.getByRole('button', { name: /salvar evento/i })
      await user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Minimal Event',
        description: '',
        startDate: '2024-01-15',
        startTime: '10:00',
        endDate: '',
        endTime: '',
        location: '',
        capacity: '',
        isPublic: true
      })
    })

    it('should not submit form when loading', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} loading={true} />)

      const submitButton = screen.getByRole('button', { name: /salvando/i })
      expect(submitButton).toBeDisabled()

      await user.click(submitButton)
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Date Constraints', () => {
    it('should set minimum date to today for start date', () => {
      render(<EventForm {...defaultProps} />)

      const startDateInput = screen.getByLabelText('Data de Início *')
      const today = new Date().toISOString().split('T')[0]

      expect(startDateInput).toHaveAttribute('min', today)
    })

    it('should set minimum date based on start date for end date', async () => {
      const user = userEvent.setup()
      render(<EventForm {...defaultProps} />)

      const startDateInput = screen.getByLabelText('Data de Início *')
      const endDateInput = screen.getByLabelText('Data de Fim (opcional)')

      await user.type(startDateInput, '2024-01-15')

      expect(endDateInput).toHaveAttribute('min', '2024-01-15')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<EventForm {...defaultProps} />)

      expect(screen.getByLabelText('Título do Evento *')).toBeInTheDocument()
      expect(screen.getByLabelText('Data de Início *')).toBeInTheDocument()
      expect(screen.getByLabelText('Horário de Início *')).toBeInTheDocument()
      expect(screen.getByLabelText('Evento público (visível no site)')).toBeInTheDocument()
    })

    it('should have proper button roles and labels', () => {
      render(<EventForm {...defaultProps} />)

      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /salvar evento/i })).toBeInTheDocument()
    })

    it('should have proper form structure', () => {
      render(<EventForm {...defaultProps} />)

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })
  })

  describe('Initial Data Handling', () => {
    it('should populate form with initial data', () => {
      const initialData = {
        title: 'Initial Event',
        description: 'Initial Description',
        startDate: '2024-01-15',
        startTime: '10:00',
        endDate: '2024-01-15',
        endTime: '12:00',
        location: 'Initial Location',
        capacity: '100',
        isPublic: false
      }

      render(<EventForm {...defaultProps} initialData={initialData} />)

      expect(screen.getByDisplayValue('Initial Event')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Initial Description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10:00')).toBeInTheDocument()
      expect(screen.getByDisplayValue('12:00')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Initial Location')).toBeInTheDocument()
      expect(screen.getByDisplayValue('100')).toBeInTheDocument()
      expect(screen.getByLabelText('Evento público (visível no site)')).not.toBeChecked()
    })

    it('should handle partial initial data', () => {
      const initialData = {
        title: 'Partial Event',
        isPublic: false
      }

      render(<EventForm {...defaultProps} initialData={initialData} />)

      expect(screen.getByDisplayValue('Partial Event')).toBeInTheDocument()
      expect(screen.getByLabelText('Evento público (visível no site)')).not.toBeChecked()
      // Other fields should have default values
      expect(screen.getByDisplayValue('')).toBeInTheDocument() // Empty description
    })
  })
})
