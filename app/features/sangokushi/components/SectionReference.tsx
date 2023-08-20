import React from 'react'
import nl2br from 'react-nl2br'
import { Button, HStack, Popover, PopoverContent, PopoverTrigger } from '~/components/ui'
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
          <Button size="xs" variant="link">
            原文
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <HStack className="font-bold">
            <p>{section.chapterNumber}</p>
            <p>{section.chapterTitle}</p>
            <p>{section.sectionNumber}</p>
          </HStack>
          <div className="h-[20rem] overflow-auto">{nl2br(section.content)}</div>
        </PopoverContent>
      </Popover>
    </React.Fragment>
  )
}
