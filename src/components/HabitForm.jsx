import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from '@emotion/styled'
import { addHabit, getHabit, updateHabit } from '../lib/db'

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-secondary);
  border: var(--border-thick);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-text);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-weight: bold;
`

const Input = styled.input`
  padding: 0.75rem;
  border: var(--border-thin);
  background: var(--color-primary);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-width: 3px;
  }
`

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: var(--border-thin);
  background: var(--color-primary);
  font-size: 1rem;
  min-height: 100px;

  &:focus {
    outline: none;
    border-width: 3px;
  }
`

const Button = styled.button`
  padding: 1rem;
  background: var(--color-primary);
  border: var(--border-thick);
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-text);
  transform: translate(-2px, -2px);
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;

  &:active {
    transform: translate(0, 0);
    box-shadow: 0 0 0 var(--color-text);
  }
`

function HabitForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily'
  })

  useEffect(() => {
    if (id) {
      loadHabit()
    }
  }, [id])

  const loadHabit = async () => {
    const habit = await getHabit(id)
    if (habit) {
      setFormData(habit)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (id) {
      await updateHabit(id, formData)
    } else {
      await addHabit(formData)
    }
    
    navigate('/')
  }

  return (
    <FormContainer>
      <h2>{id ? 'Edit Habit' : 'Create New Habit'}</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Habit Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            type="text"
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button type="submit">
          {id ? 'Update Habit' : 'Create Habit'}
        </Button>
      </Form>
    </FormContainer>
  )
}

export default HabitForm
