import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Loader2 } from "lucide-react";
// import { apiRequest } from "@/lib/api"; 
import { getApiUrl } from "@/lib/api";
const API_URL = getApiUrl(); 


export function DraftsDialog({ open, onClose }) {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingDraftId, setLoadingDraftId] = useState(null);

  const handleOpenDraftInNewTab = async (draft) => {
    setLoadingDraftId(draft._id);
    try {
      // const { roomId } = await apiRequest("/api/rooms", {
      //   method: "POST",
      // });

      const response = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to create room");
      }
      
      const { roomId } = await response.json();
      window.open(`${window.location.origin}/room/${roomId}?draftId=${draft._id}`, '_blank');
      onClose();
    } catch (error) {
      console.error("Failed to open draft in new tab:", error);
    } finally {
      setLoadingDraftId(null);
    }
  };

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      // const data = await fetch("/api/drafts");
      const response = await fetch(`${API_URL}/api/drafts`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setDrafts(data);
      }
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDrafts();
    }
  }, [open]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      // await apiRequest(`/api/drafts/${id}`, {
      //   method: "DELETE",
      // });
      const response = await fetch(`/api/draft/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      // const draftData = await response.json();
      if (response.ok) {
        setDrafts(drafts.filter(d => d._id !== id));
      }
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Failed to delete draft:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">My Drafts</DialogTitle>
            <DialogDescription>
              Your saved drafts. Click on a draft to open it in a new tab.
            </DialogDescription>
          </DialogHeader>

          <div className="h-[400px] mt-4 pr-4 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <p>No drafts saved yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {drafts.map((draft) => (
                  <motion.div
                    key={draft._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors ${loadingDraftId === draft._id ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => handleOpenDraftInNewTab(draft)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {loadingDraftId === draft._id ? (
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        ) : (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{draft.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(draft.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleDelete(draft._id, e)}
                      disabled={deletingId === draft._id}
                    >
                      {deletingId === draft._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
