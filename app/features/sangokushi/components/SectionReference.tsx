import React from 'react'
import nl2br from 'react-nl2br'
import { Button, HStack, Popover, PopoverContent, PopoverTrigger } from '~/components/ui'
import type { Doc } from '~/services/api-client'

interface SectionReferenceProps {
  section: Partial<Doc>
  children: React.ReactNode
}
export const SectionReference = ({ section, children }: SectionReferenceProps) => {
  return (
    <React.Fragment key={section.id}>
      {children}

      <p className="text-slate-700">吉川英治 「三国志」 {section.volume_title}</p>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="xs" variant="link">
            原文
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <HStack className="font-bold">
            <p>{section.volume_title}</p>
            <p>{section.chapter_title}</p>
            <p>{section.section_number}</p>
          </HStack>
          <div className="h-[20rem] overflow-auto text-sm">{nl2br(section.content)}</div>
        </PopoverContent>
      </Popover>
    </React.Fragment>
  )
}
