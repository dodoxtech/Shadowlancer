import type { Message } from "@/types";

interface MessagesCardProps {
  messages: Message[];
  unreadCount: number;
}

export function MessagesCard({ messages, unreadCount }: MessagesCardProps) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline text-lg font-bold">Messages</h2>
        {unreadCount > 0 && (
          <span className="w-5 h-5 bg-error text-on-error rounded-full flex items-center justify-center text-[10px] font-bold">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex gap-4 items-start cursor-pointer hover:bg-surface-container-low -mx-4 p-4 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.avatarSrc}
                alt={message.sender}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h4 className="font-headline font-bold text-sm truncate">
                  {message.sender}
                </h4>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {message.time}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-1 font-body">
                {message.preview}
              </p>
            </div>
          </div>
        ))}

        <button className="w-full text-center py-2 text-xs font-label font-bold text-primary hover:text-on-surface transition-colors mt-2 cursor-pointer">
          Go to Inbox
        </button>
      </div>
    </div>
  );
}
