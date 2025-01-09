'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ChatInputProps {
  channelId: string;
}

export function ChatInput({ channelId }: ChatInputProps) {
  const [message, setMessage] = useState("");

  return (
    <div className="p-4 border-t">
      <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
} 