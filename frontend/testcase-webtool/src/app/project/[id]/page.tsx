"use client"
import TestCasesPage from "@/components/test-case/testcases";
import { useParams, useSearchParams } from "next/navigation";

const TCPage =   () => {
  const search = useParams();
  let  id = ""
  if(search.id){
      id = search.id?.toString();
  }
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  return (
    <>
    <div className=" p-5 ml-20">
    <h1 className="text-2xl font-bold">{name}</h1>
    </div>
    <TestCasesPage projectId={id ? id : ""}/>
    </>
  );
}

export default TCPage;