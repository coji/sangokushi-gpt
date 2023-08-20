import { Link } from '@remix-run/react'
import { ExternalLinkIcon } from 'lucide-react'
import React from 'react'
import nl2br from 'react-nl2br'
import { Button, Card, CardContent, CardHeader, HStack, Popover, PopoverContent, PopoverTrigger } from '~/components/ui'
import type { Section } from '~/types/model'

interface SectionReferenceProps {
  section: Partial<Section>
  children: React.ReactNode
}
export const SectionReference = ({ section, children }: SectionReferenceProps) => {
  return (
    <React.Fragment key={section.id}>
      {children}

      <p className="text-slate-700">吉川英治 「三国志」 {section.volumeTitle}</p>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            原文
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Card>
            <CardHeader>
              <HStack>
                <p>{section.chapterNumber}</p>
                <p>{section.chapterTitle}</p>
                <p>{section.sectionNumber}</p>
                <Button asChild size="sm" variant="outline">
                  <ExternalLinkIcon className="mr-2" />
                  <Link
                    to="https://github.com/coji/sangokushi-gpt/blob/main/app/features/sangokushi/actions/generate-action.server.ts#L14"
                    target="_blank"
                  >
                    Prompt
                  </Link>
                </Button>
              </HStack>
            </CardHeader>
            <CardContent>
              <div className="h-[20rem] overflow-auto">{nl2br(section.content)}</div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </React.Fragment>
  )
}
