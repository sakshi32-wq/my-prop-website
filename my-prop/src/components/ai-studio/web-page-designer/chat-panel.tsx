import { useState } from "react"
import { Code2Icon, SendIcon, SparklesIcon } from "lucide-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Spinner } from "@/components/ui/spinner"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  pending?: boolean
}

const EXAMPLE_PROMPTS = [
  "Create a modern property hero section with gradient background",
  "Design a luxury amenities showcase with image grid",
  "Build a contact form with property inquiry fields",
  "Make a pricing table for different apartment types",
]

export function ChatPanel({
  messages,
  generating,
  onSend,
}: {
  messages: Array<ChatMessage>
  generating: boolean
  onSend: (prompt: string) => void
}) {
  const [prompt, setPrompt] = useState("")
  const canSend = prompt.trim().length > 0 && !generating

  function send() {
    if (!canSend) return
    onSend(prompt.trim())
    setPrompt("")
  }

  return (
    <Card size="sm" className="h-[28rem] lg:h-[36rem]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-muted-foreground" />
          Describe Your Web Page
        </CardTitle>
        <CardDescription>
          Tell AI what you want to create and watch it build in real-time
        </CardDescription>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col">
        {messages.length === 0 ? (
          <Empty className="justify-start overflow-y-auto p-2">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Code2Icon />
              </EmptyMedia>
              <EmptyTitle>Start Building with AI</EmptyTitle>
              <EmptyDescription>
                Try one of these example prompts:
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="max-w-full">
              {EXAMPLE_PROMPTS.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  className="h-auto w-full justify-start py-2 text-left whitespace-normal"
                  disabled={generating}
                  onClick={() => onSend(example)}
                >
                  {example}
                </Button>
              ))}
            </EmptyContent>
          </Empty>
        ) : (
          <MessageScrollerProvider autoScroll>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-4 py-2">
                  {messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      <Message
                        align={message.role === "user" ? "end" : "start"}
                      >
                        <MessageContent>
                          <Bubble
                            variant={
                              message.role === "user" ? "default" : "muted"
                            }
                            align={message.role === "user" ? "end" : "start"}
                          >
                            <BubbleContent>
                              {message.pending ? (
                                <span className="flex items-center gap-2">
                                  <Spinner />
                                  <span className="shimmer">
                                    {message.content}
                                  </span>
                                </span>
                              ) : (
                                message.content
                              )}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        )}
      </CardContent>

      <CardFooter>
        <form
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <InputGroup>
            <InputGroupTextarea
              aria-label="Describe what you want to create or change"
              placeholder="Describe what you want to create or change..."
              rows={2}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  send()
                }
              }}
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="hidden text-xs sm:flex">
                <Kbd>Enter</Kbd> to send, <Kbd>Shift</Kbd>+<Kbd>Enter</Kbd> for
                new line
              </InputGroupText>
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-xs"
                className="ml-auto"
                disabled={!canSend}
                aria-label="Send"
              >
                <SendIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </CardFooter>
    </Card>
  )
}
