'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const PlanPage = () => {
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
        <section className="mx-12">
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
        </section>
    </div>
  )
}
export default PlanPage