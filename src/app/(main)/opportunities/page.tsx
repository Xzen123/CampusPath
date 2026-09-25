import { getOpportunities } from '@/lib/data';
import { getUser } from '@/lib/session';
import OpportunityList from '@/components/opportunities/opportunity-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function OpportunitiesPage() {
  const user = await getUser();
  const allOpportunities = await getOpportunities();
  const internships = allOpportunities.filter(o => o.type === 'Internship');
  const fullTimeJobs = allOpportunities.filter(o => o.type === 'Full-time');
  const trainings = allOpportunities.filter(o => o.type === 'Training');

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Discover Opportunities</h1>
            <p className="text-muted-foreground">Browse and apply for jobs, internships, and trainings.</p>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="full-time">Full-time</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
          <TabsTrigger value="trainings">Trainings</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OpportunityList opportunities={allOpportunities} userRole={user?.role} />
        </TabsContent>
        <TabsContent value="full-time">
          <OpportunityList opportunities={fullTimeJobs} userRole={user?.role} />
        </TabsContent>
        <TabsContent value="internships">
          <OpportunityList opportunities={internships} userRole={user?.role} />
        </TabsContent>
        <TabsContent value="trainings">
          <OpportunityList opportunities={trainings} userRole={user?.role} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
