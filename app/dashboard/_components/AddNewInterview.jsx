"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle, Stars } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
function AddNewInterview() {
  const { user } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setjobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
    // setOpenDialog(false);
    const InputPrompt =
      "Job Position: " +
      jobPosition +
      ", Job Description: " +
      jobDesc +
      ", Years of Experience: " +
      jobExperience +
      ".Depend on the job Position, Job Description and Years of Experience, give us " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " interview questions along with the answers in JSON format.Always generate JSON format withoutmost accuracy so that i can parse it using JSON.parse() method. Everytime Result should only contain array of questions and answers in JSON format nothing other than that.";

    const result = await chatSession.sendMessage(InputPrompt);
    console.log("result Response :"+result.response.text());
    const mockJSONResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "").trim();
    console.log("MOCK JSON RESPONSE::::::::/n"+mockJSONResp);
    setJsonResponse(mockJSONResp);
    if (mockJSONResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: mockJSONResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY HH:mm:ss"),
        })
        .returning({ mockId: MockInterview.mockId });
      console.log("Inserted ID: ", resp);
      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else console.log("Error in generating JSON response");
    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg">+ Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription asChild>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Detilas about your job position/role, Job Description
                    and years of experience
                  </h2>
                  <div className="mt-7 my-2">
                    <label>Job Role/Position</label>
                    <Input
                      placeholder="Full Stack Developer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className="mt-7 my-2">
                    <label>Job Description/TechStack</label>
                    <Textarea
                      placeholder="Ex. React, Angular, Nodejs, mysql,etc"
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>
                  <div className="mt-7 my-2">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 2,4"
                      type="Number"
                      max="50"
                      required
                      onChange={(e) => setjobExperience(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        <Stars />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
