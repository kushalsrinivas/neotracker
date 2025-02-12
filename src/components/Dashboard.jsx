import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { getAllHabits, toggleHabitCompletion, getHeatmapData } from '../lib/db'
import ScoreIndicator from './ScoreIndicator'
import HeatMap from './HeatMap'

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`

const HabitGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-top: 2rem;
`

const HabitCard = styled.div`
  background: var(--color-secondary);
  border: var(--border-thick);
  padding: 1.5rem;
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-text);
  transform: translate(-2px, -2px);
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;

  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: calc(var(--shadow-offset) + 2px) calc(var(--shadow-offset) + 2px) 0 var(--color-text);
  }
`

const HabitTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StreakBadge = styled.span`
  background: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border: 2px solid var(--color-text);
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`

const HabitActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.completed ? 'var(--color-secondary)' : 'var(--color-primary)'};
  border: var(--border-thin);
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--color-text);
  transform: translate(-2px, -2px);
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;

  &:active {
    transform: translate(0, 0);
    box-shadow: 0 0 0 var(--color-text);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: var(--color-secondary);
  border: var(--border-thick);
  margin-top: 2rem;
`

const ProgressBar = styled.div`
  height: 8px;
  background: var(--color-background);
  border: var(--border-thin);
  margin-top: 1rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: var(--color-primary);
    transition: width 0.3s ease-in-out;
  }
`

function Dashboard() {
  const [habits, setHabits] = useState([])
  const [totalScore, setTotalScore] = useState(0)
  const [heatmapData, setHeatmapData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [habitsList, heatmap] = await Promise.all([
        getAllHabits(),
        getHeatmapData()
      ])
      
      setHabits(habitsList)
      setHeatmapData(heatmap)
      
      // Calculate total score
      const score = habitsList.reduce((sum, habit) => sum + (habit.score || 0), 0)
      setTotalScore(score)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCompletion = async (habitId) => {
    try {
      setLoading(true)
      const completed = await toggleHabitCompletion(habitId)
      if (completed) {
        await loadDashboard() // Reload all data to update streaks and heatmap
      }
    } catch (error) {
      console.error('Error toggling habit:', error)
    } finally {
      setLoading(false)
    }
  }

  if (habits.length === 0) {
    return (
      <DashboardContainer>
        <EmptyState>
          <h2>No habits tracked yet!</h2>
          <p>Start by adding a new habit to track.</p>
          <Link to="/add">
            <Button>Add Your First Habit</Button>
          </Link>
        </EmptyState>
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      <ScoreIndicator score={totalScore} />
      <HeatMap data={heatmapData} />
      
      <HabitGrid>
        {habits.map((habit) => (
          <HabitCard key={habit.id}>
            <HabitTitle>
              {habit.name}
              {habit.streak > 2 && (
                <StreakBadge>
                  🔥 {habit.streak} days
                </StreakBadge>
              )}
            </HabitTitle>
            <p>{habit.description}</p>
            <p>Frequency: {habit.frequency}</p>
            <ProgressBar progress={(habit.streak || 0) * 10} />
            <HabitActions>
              <Button 
                onClick={() => handleToggleCompletion(habit.id)}
                completed={habit.completedToday}
                disabled={loading || habit.completedToday}
              >
                {habit.completedToday ? '✓ Completed' : '+ Complete'}
              </Button>
              <Link to={`/edit/${habit.id}`}>
                <Button disabled={loading}>Edit</Button>
              </Link>
            </HabitActions>
          </HabitCard>
        ))}
      </HabitGrid>
    </DashboardContainer>
  )
}

export default Dashboard
