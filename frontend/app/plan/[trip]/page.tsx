'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useParams } from "next/navigation"
import { useState } from "react"

type Blog = {
  message: string;
  blog: {
    createdAt: string;
    updatedAt: string;
    id: number;
    TripId: number;
    UserId: number;
    title: string;
    description: string;
    notableEvents: string;
  }
}




const PlanPage = () => {
  const tripId = useParams().trip[0];
  const [data, setData] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlog = async (tripId:string) => {
    setIsLoading(true);
    const response = (await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/generate-blog`, {
      "tripId":tripId,
      "title":"Amazing trip",
      "notableEvents":"nothing"
  },{
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyOTc2NzQzNSwiZXhwIjoxNzI5NzcxMDM1fQ.qQTx_F9duVGFBUiSbhRk9kxkWhdH40dsRx5ERu7Ue1M`
      }
  })).data;
  
    setData(response);
    setIsLoading(false);
  }

  


  return (
    <div className="">
        {/* <section>
            <Image src="https://source.unsplash.com/1600x900/?france"  width={100} height={50} alt="France" />
        </section> */}
        <section className=" p-5 border-2 mx-12 my-10 rounded-lg">
            <h1 className="font-bold text-xl">Trip to France</h1>
            <p className="text-gray-500">Created by DRJ</p>
            <div className="flex justify-between">
                <div>
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-bold">2023-06-01</p>
                </div>
                <div>
                    <p className="text-gray-500">End Date</p>
                    <p className="font-bold">2023-06-15</p>
                </div>
            </div>
        </section>
        <section className="mx-12 flex flex-col gap-10">
            <Accordion type="single" collapsible>
                <AccordionItem value="Day-1">
                    <AccordionTrigger className="flex items-baseline justify-between">
                        <h1 className="font-bold text-xl">Day 1</h1>
                        <p className="text-gray-500">2023-06-01</p>
                    </AccordionTrigger>
                    <AccordionContent className="mx-12 my-5">
                            <p className="font-bold">Paris</p>
                            <p className="text-gray-500">Eiffel Tower, Louvre Museum, Notre Dame Cathedral</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Button disabled={isLoading} onClick={() => fetchBlog(tripId)}>Generate Blog</Button>
            <section>
              {isLoading && <p>Loading...</p>}
              {data && <section>
                  <h1 className="text-2xl font-bold">{data.blog.title}</h1>
                  <p>{data.blog.description}</p>
                  
              </section>}
            </section>
        </section>
    </div>
  )
}
export default PlanPage