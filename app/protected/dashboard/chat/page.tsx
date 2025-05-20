// app/chat/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("group");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const groupChats = [
    {
      id: "math-7",
      name: "Grade 7 Math Class",
      lastMessage: "Sarah: Did anyone solve problem 5?",
      time: "2:30 PM",
      unread: 3,
      avatar: "/group-math.png",
    },
    {
      id: "science-8",
      name: "Grade 8 Science Group",
      lastMessage: "Teacher: Remember lab tomorrow",
      time: "Yesterday",
      unread: 0,
      avatar: "/group-science.png",
    },
  ];

  const directChats = [
    {
      id: "sarah-j",
      name: "Sarah Johnson",
      lastMessage: "Can you help with the homework?",
      time: "10:45 AM",
      unread: 1,
      avatar: "/avatar-sarah.jpg",
    },
    {
      id: "mr-chen",
      name: "Mr. Chen",
      lastMessage: "Your project looks good!",
      time: "Monday",
      unread: 0,
      avatar: "/avatar-chen.jpg",
    },
  ];

  const currentChat = activeTab === "group" ? groupChats[0] : directChats[0];
  const chats = activeTab === "group" ? groupChats : directChats;

  return (
    <div className="flex h-screen bg-background w-full">
      {/* Chat List Sidebar */}
      <div className="w-full md:w-80 border-r border-muted">
        <div className="p-4 border-b border-muted">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="group">Group Chats</TabsTrigger>
            <TabsTrigger value="direct">Direct Messages</TabsTrigger>
          </TabsList>

          <div className="mt-2 space-y-1">
            {chats
              .filter(
                (chat) =>
                  chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  chat.lastMessage
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
              )
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${currentChat.id === chat.id ? "bg-muted" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>
                        {chat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">{chat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {chat.time}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Tabs>

        <div className="p-4 border-t border-muted">
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            New {activeTab === "group" ? "Group" : "Chat"}
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-muted flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={currentChat.avatar} />
            <AvatarFallback>
              {currentChat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold">{currentChat.name}</h2>
            <p className="text-sm text-muted-foreground">
              {activeTab === "group" ? "Group chat" : "Direct message"}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Sample messages */}
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="font-medium">Sarah Johnson</p>
                <p>Hey everyone, did you finish the math homework?</p>
                <p className="text-xs text-muted-foreground mt-1">2:15 PM</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs md:max-w-md">
                <p>I'm stuck on problem 5. Any hints?</p>
                <p className="text-xs text-primary-foreground/70 mt-1">
                  2:18 PM
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-xs md:max-w-md">
                <p className="font-medium">Mr. Chen</p>
                <p>Remember to use the quadratic formula for problem 5</p>
                <p className="text-xs text-muted-foreground mt-1">2:25 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-muted">
          <div className="flex space-x-2">
            <Input
              placeholder={`Message ${currentChat.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button disabled={!message.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
