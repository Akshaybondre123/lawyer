import AIMarketingLayout from "@/components/layouts/ai-marketing-layout"
import AIMarketingHeader from "@/components/ai-marketing/ai-marketing-header"
import LegalContentGenerator from "@/components/ai-marketing/legal-content-generator"
import PostHistory from "@/components/ai-marketing/post-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIMarketingPage() {
  return (
    <AIMarketingLayout>
      <div className="flex flex-col gap-6">
        <AIMarketingHeader />

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="history">Post History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-4">
            <LegalContentGenerator />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <PostHistory />
          </TabsContent>
        </Tabs>
      </div>
    </AIMarketingLayout>
  )
}
