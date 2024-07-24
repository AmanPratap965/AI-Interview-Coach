"use client";
import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState([]);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  useEffect(() => {
    console.log(params.interviewId);
    getInterviewDetails();
  }, [webCamEnabled]);
  const getInterviewDetails = () => {
    const result =  db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
    console.log(result);
  };
  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col my-5 gap-5 ">
          <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg ">
              <strong>Job Role/Job Position: </strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg ">
              <strong>Job Description/Tech Stack: </strong>
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg ">
              <strong>Years of Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300  bg-yellow-100">
            <h2 className="flex gap-2 items-center">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-800">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>
        <div className="">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => {
                setWebCamEnabled(true);
              }}
              onUserMediaError={() => setWebCamEnabled(false)}
              style={{ height: 400, width: 300 }}
              mirrored={true.toString()}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full p-20 rounded-lg border bg-secondary my-5" />
              <Button
                className="w-full"
                variant="link"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Micropone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end ">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;
