import { isAuthanticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const Authlayout = async ({children}:{children:ReactNode}) => {
    const isUserAuthanticated= await isAuthanticated()
    if(isUserAuthanticated) redirect('/')
  return (
    
    <div className='auth-layout'>{children}</div>
  )
}

export default Authlayout