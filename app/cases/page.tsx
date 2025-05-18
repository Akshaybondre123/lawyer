import CasesLayout from "@/components/layouts/cases-layout"
import CasesTable from "@/components/cases/cases-table"
import CasesHeader from "@/components/cases/cases-header"
import { getCases } from "@/lib/api/cases-api"

export default async function CasesPage() {
  // In a real app, this would use server-side data fetching
  const cases = await getCases({ status: "all" })

  return (
    <CasesLayout>
      <div className="flex flex-col gap-6">
        <CasesHeader />
        <CasesTable initialCases={cases} />
      </div>
    </CasesLayout>
  )
}
