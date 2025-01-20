"use client"
import TestCasesPage from "@/components/test-case/testcases";
import { useSearchParams } from "next/navigation";

const TCPage =   () => {
  const search = useSearchParams();
  const name = search.get("name");
  const id = search.get("id");
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