import { openDB } from 'idb'

const DB_NAME = 'habit-tracker'
const DB_VERSION = 1

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create habits store
      if (!db.objectStoreNames.contains('habits')) {
        const habitStore = db.createObjectStore('habits', {
          keyPath: 'id',
          autoIncrement: true
        })
        habitStore.createIndex('name', 'name')
      }

      // Create logs store
      if (!db.objectStoreNames.contains('logs')) {
        const logStore = db.createObjectStore('logs', {
          keyPath: 'id',
          autoIncrement: true
        })
        logStore.createIndex('habitId', 'habitId')
        logStore.createIndex('date', 'date')
      }
    }
  })
  return db
}

export async function addHabit(habit) {
  const db = await initDB()
  return db.add('habits', {
    ...habit,
    createdAt: new Date().toISOString(),
    streak: 0,
    score: 0,
    completedToday: false
  })
}

export async function getAllHabits() {
  const db = await initDB()
  const habits = await db.getAll('habits')
  
  // Check if each habit is completed today
  const today = new Date().toISOString().split('T')[0]
  const logs = await db.getAllFromIndex('logs', 'date', today)
  
  return habits.map(habit => ({
    ...habit,
    completedToday: logs.some(log => log.habitId === habit.id)
  }))
}

export async function getHabit(id) {
  const db = await initDB()
  return db.get('habits', Number(id))
}

export async function updateHabit(id, updates) {
  const db = await initDB()
  const habit = await db.get('habits', Number(id))
  return db.put('habits', { ...habit, ...updates })
}

export async function deleteHabit(id) {
  const db = await initDB()
  
  // Delete all logs for this habit
  const tx = db.transaction(['logs'], 'readwrite')
  const logs = await tx.store.index('habitId').getAll(id)
  for (const log of logs) {
    await tx.store.delete(log.id)
  }
  
  // Delete the habit
  return db.delete('habits', Number(id))
}

export async function logHabit(habitId, date = new Date()) {
  const db = await initDB()
  const dateStr = date.toISOString().split('T')[0]
  
  // Check if already logged today
  const existingLogs = await db.getAllFromIndex('logs', 'date', dateStr)
  const alreadyLogged = existingLogs.some(log => log.habitId === habitId)
  
  if (!alreadyLogged) {
    return db.add('logs', {
      habitId,
      date: dateStr,
      timestamp: new Date().toISOString()
    })
  }
  return null
}

export async function getHabitLogs(habitId, days = 35) {
  const db = await initDB()
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const logs = await db.getAllFromIndex('logs', 'habitId', habitId)
  return logs.filter(log => {
    const logDate = new Date(log.date)
    return logDate >= startDate && logDate <= endDate
  })
}

export async function getHeatmapData(days = 35) {
  const db = await initDB()
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  // Get all logs within date range
  const tx = db.transaction(['logs'], 'readonly')
  const logs = await tx.store.getAll()
  
  // Create a map of dates to completion counts
  const heatmapData = {}
  logs.forEach(log => {
    const date = log.date
    heatmapData[date] = (heatmapData[date] || 0) + 1
  })
  
  // Normalize the data between 0 and 1
  const maxCount = Math.max(...Object.values(heatmapData), 1)
  Object.keys(heatmapData).forEach(date => {
    heatmapData[date] = heatmapData[date] / maxCount
  })
  
  return heatmapData
}

export async function toggleHabitCompletion(habitId) {
  const db = await initDB()
  const today = new Date().toISOString().split('T')[0]
  const habit = await getHabit(habitId)
  
  // Check if already completed today
  const todayLogs = await db.getAllFromIndex('logs', 'date', today)
  const alreadyCompleted = todayLogs.some(log => log.habitId === habitId)
  
  if (!alreadyCompleted) {
    // Log completion
    await logHabit(habitId, new Date())
    
    // Check yesterday's completion for streak
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const yesterdayLogs = await db.getAllFromIndex('logs', 'date', yesterdayStr)
    const wasCompletedYesterday = yesterdayLogs.some(log => log.habitId === habitId)
    
    // Update streak and score
    const newStreak = wasCompletedYesterday ? (habit.streak || 0) + 1 : 1
    const newScore = (habit.score || 0) + (newStreak * 10) // Score increases with streak multiplier
    
    await updateHabit(habitId, { 
      streak: newStreak,
      score: newScore,
      lastCompleted: today
    })
    
    return true
  }
  
  return false
}
