// src/app/(auth)/dashboard/messaging/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ChatSidebar from "@/components/messaging/ChatSidebar";
import { fetchConversations } from "@/lib/data-access/messaging/data";
import { Role } from "@/lib/definitions";
import MessagingContainer from "@/components/messaging/MessagingContainer";


const MessagingPage = async () => {
    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const userId = session.user.id;
    const role = session.user.role as Role;
    const hospitalId = session.user.hospitalId;

    // Fetch conversations from the database
    const conversations = await fetchConversations(userId);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <ChatSidebar userId={userId} conversations={conversations} selectedConversationId={null} onSelectConversation={function (conversationId: string): void {
                throw new Error("Function not implemented.");
            } } />

            {/* Main Chat Panel */}
            <MessagingContainer userId={userId} conversations={conversations} />
        </div>
    );
};

export default MessagingPage;