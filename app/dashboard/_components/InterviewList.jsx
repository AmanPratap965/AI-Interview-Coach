"use client"
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db';
import {eq} from'drizzle-orm';
import { useUser } from "@clerk/nextjs";
import { desc } from 'drizzle-orm';
import InterviewItemCard from './InterviewItemCard';
const InterviewList = () => {
    const {user}=useUser();
    const [interviewList,setInterviewList]=useState([]);
    useEffect(()=>{
        user && GetInterviewList();
        
    },[user])
    const GetInterviewList=async()=>{
        const result=await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));
        console.log(result);
        setInterviewList(result);
    }
  return (
    <div>
        <h2 className='font-medium text-xl '>Previous Mock Interviews</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {interviewList.map((interview,index)=>(
                <InterviewItemCard key={index} interview={interview}/>
            ))}
        </div>
    </div>
  )
}

export default InterviewList