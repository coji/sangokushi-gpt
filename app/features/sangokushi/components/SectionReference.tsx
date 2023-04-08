import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import nl2br from 'react-nl2br'
import { type Section } from 'types/model'

interface SectionReferenceProps {
  section: Partial<Section>
  children: React.ReactNode
}
export const SectionReference = ({
  section,
  children,
}: SectionReferenceProps) => {
  return (
    <React.Fragment key={section.id}>
      {children}

      <Text color="gray.700">吉川英治 「三国志」 {section.volumeTitle}</Text>

      <Popover trigger="hover">
        <PopoverTrigger>
          <Button size="xs" colorScheme="blue" variant="outline">
            原文
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <HStack>
              <Text noOfLines={1}>{section.chapterNumber}</Text>
              <Text noOfLines={1}>{section.chapterTitle}</Text>
              <Text noOfLines={1}>{section.sectionNumber}</Text>
              <Button
                as="a"
                rightIcon={<ExternalLinkIcon />}
                href="https://github.com/coji/sangokushi-gpt/blob/main/app/features/sangokushi/actions/generate-action.server.ts#L14"
                target="_blank"
                size="xs"
                variant="outline"
                colorScheme="blue"
              >
                Prompt
              </Button>
            </HStack>
          </PopoverHeader>
          <PopoverBody>
            <Box overflow="auto" height="20rem">
              {nl2br(section.content)}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </React.Fragment>
  )
}
