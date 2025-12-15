import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

function getInitials(name) {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getRingColor(hexColor) {
  const colorMap = {
    "#3B82F6": "ring-blue-500",
    "#22C55E": "ring-green-500",
    "#A855F7": "ring-purple-500",
    "#EC4899": "ring-pink-500",
    "#F97316": "ring-orange-500",
    "#06B6D4": "ring-cyan-500",
    "#6366F1": "ring-indigo-500",
    "#F43F5E": "ring-rose-500",
  };
  return colorMap[hexColor] || "ring-blue-500";
}

export function Collaborators({ users, currentUserId }) {
  const uniqueUsers = users.filter((user, index, self) => 
    index === self.findIndex((u) => u.id === user.id)
  );

  if (uniqueUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        <AnimatePresence mode="popLayout">
          {uniqueUsers.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            const initials = getInitials(user.username);
            const ringColor = getRingColor(user.color);

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                style={{ zIndex: uniqueUsers.length - index }}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar 
                      className={`border-2 border-white dark:border-neutral-900 w-9 h-9 ring-2 ring-offset-1 ring-offset-transparent ${ringColor} cursor-pointer hover:scale-110 transition-transform`}
                    >
                      <AvatarFallback 
                        style={{ backgroundColor: user.color }}
                        className="text-white text-xs font-bold"
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.username}{isCurrentUser ? " (You)" : ""}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="ml-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-muted-foreground">
          {uniqueUsers.length} {uniqueUsers.length === 1 ? "user" : "users"} online
        </span>
      </div>
    </div>
  );
}
