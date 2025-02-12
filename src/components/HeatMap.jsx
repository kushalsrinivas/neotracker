import React from 'react'
import styled from '@emotion/styled'

const HeatMapContainer = styled.div`
  margin: 2rem 0;
  padding: 1rem;
  background: var(--color-secondary);
  border: var(--border-thick);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-text);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-top: 1rem;
`

const Day = styled.div`
  aspect-ratio: 1;
  background: ${props => {
    const intensity = props.intensity || 0
    return `rgba(255, 67, 101, ${intensity})`
  }};
  border: 2px solid var(--color-text);
  transition: transform 0.1s ease-in-out;
  position: relative;

  &:hover {
    transform: scale(1.1);
    z-index: 1;
  }

  &::before {
    content: '${props => props.tooltip}';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-text);
    color: var(--color-background);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
    white-space: nowrap;
  }

  &:hover::before {
    opacity: 1;
  }
`

const Legend = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: bold;
`

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
`

function HeatMap({ data }) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Generate last 35 days (5 weeks) of data
  const days = Array.from({ length: 35 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayName = weekDays[date.getDay()]
    return {
      date: dateStr,
      dayName,
      intensity: data[dateStr] || 0
    }
  }).reverse()

  return (
    <HeatMapContainer>
      <h3>HABIT STREAK HEATMAP</h3>
      <WeekDays>
        {weekDays.map(day => (
          <div key={day}>{day}</div>
        ))}
      </WeekDays>
      <Grid>
        {days.map((day, i) => (
          <Day 
            key={i} 
            intensity={day.intensity}
            tooltip={`${day.date}: ${Math.round(day.intensity * 100)}% completed`}
          />
        ))}
      </Grid>
      <Legend>
        <span>Less Active</span>
        <span>More Active</span>
      </Legend>
    </HeatMapContainer>
  )
}

export default HeatMap
