'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Opportunity, Role } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function OpportunityCard({ opportunity, userRole }: { opportunity: Opportunity; userRole: Role | undefined }) {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: 'Successfully Applied!',
      description: `Your application for ${opportunity.title} has been submitted.`,
    });
  };

  const timeAgo = formatDistanceToNow(new Date(opportunity.postedAt), { addSuffix: true });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
                <Image
                    src={opportunity.logoUrl}
                    alt={`${opportunity.company} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg border"
                    data-ai-hint="company logo"
                />
                <div>
                    <CardTitle>{opportunity.title}</CardTitle>
                    <CardDescription>{opportunity.company}</CardDescription>
                </div>
            </div>
             {userRole === 'PlacementCell' && (
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {opportunity.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {opportunity.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">{timeAgo}</div>
        {userRole === 'Student' && <Button onClick={handleApply}>Apply Now</Button>}
      </CardFooter>
    </Card>
  );
}
