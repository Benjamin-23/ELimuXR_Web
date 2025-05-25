"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: "text" | "system";
};

export default function ChatPanel({
  messages,
  onSend,
  isOpen,
  onClose,
  unreadCount,
  isMobile,
}: {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  isMobile: boolean;
}) {
  const [messageInput, setMessageInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    onSend(messageInput);
    setMessageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <div
      className={cn(
        "border-l flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out",
        isOpen ? "w-80" : "w-0 overflow-hidden",
        isMobile && "absolute inset-0 z-10",
      )}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold">Chat</h3>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[85%] rounded-lg p-3 text-sm",
                message.type === "system"
                  ? "bg-gray-100 dark:bg-gray-700 mx-auto text-center italic"
                  : message.senderId === "local"
                    ? "bg-blue-100 dark:bg-blue-900 ml-auto"
                    : "bg-gray-100 dark:bg-gray-700 mr-auto",
              )}
            >
              {message.type !== "system" && (
                <div className="font-semibold text-xs mb-1">
                  {message.senderId === "local" ? "You" : message.senderName}
                </div>
              )}
              <div>{message.text}</div>
              <div className="text-xs opacity-70 mt-1 self-end">
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
