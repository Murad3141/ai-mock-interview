import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const Interview = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return <p>Please log in to access the interview generator.</p>
  }

  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={user.name} userId={user.id} type='generate' />
    </>
  )
}

export default Interview
