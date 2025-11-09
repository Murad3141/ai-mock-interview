import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser()
  const userId = user?.id

  const [userInterviews, latestInterviews] = userId
    ? await Promise.all([
        getInterviewByUserId(userId),
        getLatestInterviews({ userId: userId })
      ])
    : [null, null];

  const isArrayValid = (arr: any) => Array.isArray(arr) && arr.length > 0;

  const hasPastInterviews = isArrayValid(userInterviews);
  
  const upcomingInterviewsToShow = isArrayValid(latestInterviews) 
    ? latestInterviews 
    : dummyInterviews.slice(0, 2);

  const hasUpcomingInterviews = isArrayValid(upcomingInterviewsToShow);

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Practise & Feedback </h2>
          <p className='text-lg'>Practise on real interview questions & get instant feedback </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href='/interview'>Start an Interview</Link>
          </Button>
        </div>
        <Image src='/robot.png' alt='robot-dude' width={400} height={400} className='max-sm:hidden'/>
      </section>
      
      <section className='flex flex-col gap-6 mt-8 '>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {
            hasPastInterviews ? (
              userInterviews?.map((interview: any) => (
                <InterviewCard key={interview.id} {...interview}/>
              ))) : (
                <p>You haven`t taken any interviews yet</p>
              )
          }
        </div>
      </section>
      
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
          {
            hasUpcomingInterviews ? (
              upcomingInterviewsToShow.map((interview: any) => (
                <InterviewCard key={interview.id} {...interview}/>
              ))) : (
                <p>There are no new interviews available</p>
              )
          }
        </div>
      </section>
    </>
  )
}

export default page