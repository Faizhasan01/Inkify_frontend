import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export function NicknameDialog({ open, onSubmit }) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    
    if (trimmed.length < 2) {
      setError("Nickname must be at least 2 characters");
      return;
    }
    
    if (trimmed.length > 20) {
      setError("Nickname must be 20 characters or less");
      return;
    }
    
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Welcome to Whiteboard</DialogTitle>
            <DialogDescription>
              Enter a nickname to get started. This will be displayed to others when collaborating.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Your Nickname</Label>
                <Input
                  id="nickname"
                  placeholder="Enter your nickname..."
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setError("");
                  }}
                  autoFocus
                  className="text-lg"
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="submit" 
                className="w-full font-semibold"
                disabled={!nickname.trim()}
              >
                Start Drawing
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
