'use client';
import type { StudentProfile } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom';
import { updateProfile } from '@/lib/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function ProfileForm({ profile }: { profile: StudentProfile }) {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(updateProfile, undefined);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
    }
  }, [state, toast]);


  return (
    <form action={dispatch}>
      <input type="hidden" name="userId" value={profile.userId.toString()} />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                A brief introduction about yourself.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" defaultValue={profile.bio} rows={5} />
                {state?.errors?.bio && <p className="text-sm text-destructive">{state.errors.bio[0]}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>
                    Showcase your technical and soft skills.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" type="button">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill.id} variant="default" className="text-sm py-1">
                  {skill.name}
                </Badge>
              ))}
              {profile.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    Highlight your best work and projects.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" type="button">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.projects.map((project) => (
                <div key={project.id} className="flex gap-4 items-start">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={120}
                    height={80}
                    className="rounded-md border object-cover"
                    data-ai-hint="abstract code"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" type="button">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
               {profile.projects.length === 0 && <p className="text-sm text-muted-foreground">No projects added yet.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Academics Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Academics</CardTitle>
                  <CardDescription>
                    Your educational background.
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8" type="button">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.academics.map((record) => (
                <div key={record.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold">{record.degree}</p>
                  <p className="text-sm text-muted-foreground">
                    {record.institution}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {record.year} | GPA: {record.gpa}
                  </p>
                </div>
              ))}
              {profile.academics.length === 0 && <p className="text-sm text-muted-foreground">No academic records added yet.</p>}
            </CardContent>
          </Card>
          <div className="sticky top-24 space-y-4">
             {state?.message && (
                 <Alert variant={state.success ? 'default' : 'destructive'} className={state.success ? 'bg-green-500/10 border-green-500/30' : ''}>
                    {state.success ? <CheckCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                    <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <SaveButton />
          </div>
        </div>
      </div>
    </form>
  );
}
