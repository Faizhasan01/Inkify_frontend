import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SaveDraftDialog({ open, onClose, onSave, isSaving = false, externalError, onClearError }) {
  const [draftName, setDraftName] = useState("");
  const [error, setError] = useState("");
  
  const displayError = externalError || error;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = draftName.trim();
    
    if (trimmed.length < 1) {
      setError("Please enter a name for your draft");
      return;
    }
    
    if (trimmed.length > 50) {
      setError("Draft name must be 50 characters or less");
      return;
    }
    
    onSave(trimmed);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen && !isSaving) {
      setDraftName("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Save Draft</DialogTitle>
            <DialogDescription>
              Give your draft a name to save it. You can access it later from the Drafts menu.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="draftName">Draft Name</Label>
                <Input
                  id="draftName"
                  placeholder="Enter a name for your draft..."
                  value={draftName}
                  onChange={(e) => {
                    setDraftName(e.target.value);
                    setError("");
                    if (onClearError) onClearError();
                  }}
                  autoFocus
                  className="text-lg"
                  disabled={isSaving}
                />
                {displayError && (
                  <p className="text-sm text-destructive">{displayError}</p>
                )}
              </div>
            </div>
            
            <DialogFooter className="mt-6 gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="font-semibold"
                disabled={!draftName.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
