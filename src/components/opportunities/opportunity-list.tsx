'use client';
import { useState } from 'react';
import type { Opportunity, Role } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import OpportunityCard from './opportunity-card';

export default function OpportunityList({ opportunities, userRole }: { opportunities: Opportunity[], userRole: Role | undefined }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOpportunities = opportunities.filter(
    (opp) =>
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 mt-6">
      <Input
        placeholder="Search by title, company, or tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      {filteredOpportunities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} userRole={userRole} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg font-semibold">No opportunities found</p>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
