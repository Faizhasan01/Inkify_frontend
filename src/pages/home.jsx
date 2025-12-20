import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Canvas } from "@/components/whiteboard/Canvas";
import { Toolbar } from "@/components/whiteboard/Toolbar";
import { Collaborators } from "@/components/whiteboard/Collaborators";
import { Sidebar } from "@/components/whiteboard/Sidebar";
import { SaveDraftDialog } from "@/components/whiteboard/SaveDraftDialog";
import { DraftsDialog } from "@/components/whiteboard/DraftsDialog";
import { PageNavigator } from "@/components/whiteboard/PageNavigator";
import { Button } from "@/components/ui/button";
import { Share2, Menu, User, FileText, LogOut, Settings, Save, FilePlus, Copy, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuthContext } from "@/App";
import { apiRequest } from "@/lib/api";


export default function Home() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const params = useParams();
  const urlRoomId = params?.roomId;
  const { user, logout } = useAuthContext();
  const canvasRef = useRef(null);
  const [activeTool, setActiveTool] = useState("pencil");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [color, setColor] = useState("#2D5BFF");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [elements, setElements] = useState([]);
  
  const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);
  const [showDraftsDialog, setShowDraftsDialog] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [draftName, setDraftName] = useState("New Draft");
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [pendingSaveTitle, setPendingSaveTitle] = useState(null);
  const [saveDraftError, setSaveDraftError] = useState(null);
  
  const handleConnectionLost = useCallback(() => {
    toast({
      title: "Connection lost",
      description: "Attempting to reconnect...",
      variant: "destructive",
    });
  }, [toast]);

  const handleBoardState = useCallback((serverElements) => {
    setElements(serverElements);
  }, []);

  const handleElementCreate = useCallback((element) => {
    setElements(prev => [...prev, element]);
  }, []);

  const handleBoardClear = useCallback(() => {
    setElements([]);
  }, []);

  const handlePageState = useCallback((page, total, pageElements) => {
    setCurrentPage(page);
    setTotalPages(total);
    setElements(pageElements);
  }, []);

  const handleAllPages = useCallback(async (pages) => {
    if (!pendingSaveTitle) return;
    
    try {
      const data = await apiRequest("/api/drafts", {
        method: "POST",
        body: {
          title: pendingSaveTitle,
          pages: pages,
        },
      });

      // const response = await fetch(`${API_URL}/api/drafts`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     title: pendingSaveTitle,
      //     pages: pages,
      //   }),
      // });

      // const data = await response.json();
      
      if (!response.ok) {
        setSaveDraftError(data.error || "Failed to save draft");
        setIsSavingDraft(false);
        setPendingSaveTitle(null);
        return;
      }

      setDraftName(pendingSaveTitle);
      setCurrentDraftId(data._id);
      setShowSaveDraftDialog(false);
      setSaveDraftError(null);
      toast({
        title: "Draft saved!",
        description: `"${pendingSaveTitle}" with ${pages.length} page(s) has been saved.`,
      });
    } catch (error) {
      setSaveDraftError(error.message || "Failed to save draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
      setPendingSaveTitle(null);
    }
  }, [pendingSaveTitle, toast]);

  const handleRoomJoined = useCallback((roomId) => {
    if (!urlRoomId && roomId) {
      setLocation(`/room/${roomId}`, { replace: true });
    }
  }, [urlRoomId, setLocation]);

  const wsOptions = useMemo(() => ({
    onDisconnected: handleConnectionLost,
    onBoardState: handleBoardState,
    onElementCreate: handleElementCreate,
    onBoardClear: handleBoardClear,
    onPageState: handlePageState,
    onAllPages: handleAllPages,
    onRoomJoined: handleRoomJoined,
  }), [handleConnectionLost, handleBoardState, handleElementCreate, handleBoardClear, handlePageState, handleAllPages, handleRoomJoined]);

  const { users, currentUser, isConnected, currentRoomId, join, disconnect, sendElement, sendClear, sendUndo, sendAddPage, sendNavigatePage, sendDeletePage, sendLoadPages, sendResetPages, requestAllPages } = useWebSocket(wsOptions);

  const hasJoinedRef = useRef(false);
  const joinedRoomRef = useRef(null);

  useEffect(() => {
    const targetRoom = urlRoomId || 'default';
    if (user?.nickname && !hasJoinedRef.current) {
      hasJoinedRef.current = true;
      joinedRoomRef.current = targetRoom;
      join(user.nickname, urlRoomId);
    }
    
    return () => {
      if (joinedRoomRef.current !== targetRoom) {
        hasJoinedRef.current = false;
      }
    };
  }, [user?.nickname, urlRoomId, join]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const draftId = urlParams.get('draftId');
    
    if (draftId && isConnected) {
      const loadDraft = async () => {
        try {
          const draftData = await apiRequest(`/api/draft/${draftId}`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch draft");
          }
          
          
          
          if (draftData.pages && draftData.pages.length > 0) {
            const convertedPages = draftData.pages.map((page) => {
              const convertedElements = (page.elements || []).map((el) => {
                let points = el.points || [];
                if (Array.isArray(points) && points.length > 0) {
                  if (typeof points[0] === 'number') {
                    const convertedPoints = [];
                    for (let i = 0; i < points.length; i += 2) {
                      convertedPoints.push({ x: points[i], y: points[i + 1] });
                    }
                    points = convertedPoints;
                  }
                }
                return {
                  id: el.id,
                  type: el.tool || el.type,
                  points,
                  start: el.start,
                  end: el.end,
                  color: el.color,
                  width: el.strokeWidth || el.width,
                  text: el.text,
                };
              });
              return {
                id: page.id,
                elements: convertedElements,
              };
            });

            sendLoadPages(convertedPages);
            setDraftName(draftData.title);
            setCurrentDraftId(draftData._id);
            
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            
            toast({
              title: "Draft loaded",
              description: `"${draftData.title}" with ${draftData.pages.length} page(s) has been loaded.`,
            });
          }
        } catch (error) {
          console.error("Failed to load draft:", error);
          toast({
            title: "Error",
            description: "Failed to load draft. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      loadDraft();
    }
  }, [isConnected, sendLoadPages, toast]);

  const handleSaveDraft = (title) => {
    setIsSavingDraft(true);
    setPendingSaveTitle(title);
    requestAllPages();
  };

  const updateElements = (newElements) => {
    if (newElements.length > elements.length) {
      const newElement = newElements[newElements.length - 1];
      sendElement(newElement);
    }
    setElements(newElements);
  };

  const handleUndo = () => {
    sendUndo();
  };

  const handleRedo = () => {
    toast({
      title: "Redo",
      description: "Redo is not available in collaborative mode.",
    });
  };

  const handleClear = () => {
    sendClear();
    setElements([]);
  };

  const handleSave = () => {
    if (canvasRef.current) {
      canvasRef.current.exportImage();
      toast({
        title: "Project Saved",
        description: "Your drawing has been downloaded JPG image.",
      });
    }
  };

  const handleLogout = async () => {
    disconnect();
    await logout();
    setIsSidebarOpen(false);
    setLocation("/account");
  };

  const handleNewDraft = async () => {
    try {
      const { roomId } = await apiRequest("/api/rooms", { method: "POST" });
      window.open(`/room/${roomId}`, "_blank");
      
      if (!response.ok) {
        throw new Error("Failed to create room");
      }
      
      
      window.open(`${window.location.origin}/room/${roomId}`, '_blank');
      setIsSidebarOpen(false);
      
      toast({
        title: "New draft created",
        description: "A new canvas has been opened in a new tab.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      sendNavigatePage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      sendNavigatePage(currentPage + 1);
    }
  };

  const handleAddPage = () => {
    sendAddPage();
    toast({
      title: "New page added",
      description: `Page ${totalPages + 1} created`,
    });
  };

  const handleDeletePage = () => {
    if (totalPages > 1) {
      sendDeletePage(currentPage);
      toast({
        title: "Page deleted",
        description: `Page ${currentPage + 1} has been removed`,
      });
    }
  };

  return (
    <div className="w-screen h-screen bg-background overflow-hidden flex flex-col">
      <SaveDraftDialog
        open={showSaveDraftDialog}
        onClose={() => {
          setShowSaveDraftDialog(false);
          setSaveDraftError(null);
        }}
        externalError={saveDraftError}
        onClearError={() => setSaveDraftError(null)}
        onSave={handleSaveDraft}
        isSaving={isSavingDraft}
      />

      <DraftsDialog
        open={showDraftsDialog}
        onClose={() => setShowDraftsDialog(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} title="Menu">
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2 mb-2">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: user?.avatarColor || "#3b82f6" }}
              >
                {user?.nickname?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium">{user?.nickname}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="h-px bg-border my-2" />
          <Button 
            variant="ghost" 
            className="justify-start gap-3 w-full"
            onClick={handleNewDraft}
          >
            <FilePlus className="w-4 h-4" />
            New Draft
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start gap-3 w-full"
            onClick={() => {
              setIsSidebarOpen(false);
              setShowSaveDraftDialog(true);
            }}
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start gap-3 w-full"
            onClick={() => {
              setIsSidebarOpen(false);
              setShowDraftsDialog(true);
            }}
          >
            <FileText className="w-4 h-4" />
            My Drafts
          </Button>
          <div className="h-px bg-border my-2" />
          <Button variant="ghost" className="justify-start gap-3 w-full">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start gap-3 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </Sidebar>

      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-10 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Inkify" className="w-8 h-8 rounded" />
            <div>
              <h1 className="text-lg font-display font-semibold flex items-center gap-2">
                {draftName}
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] uppercase tracking-wider font-bold rounded-full">
                  Draft
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">Last edited just now</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Collaborators users={users} currentUserId={currentUser?.id || null} />
          <Button 
            className="gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={() => {
              const shareUrl = currentRoomId 
                ? `${window.location.origin}/room/${currentRoomId}`
                : window.location.href;
              navigator.clipboard.writeText(shareUrl);
              toast({
                title: "Link copied",
                description: "Share this link with others to collaborate on this canvas in real-time!",
              });
            }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </header>

      <main className="flex-1 relative pt-16">
        <Canvas 
          ref={canvasRef}
          tool={activeTool}
          color={color}
          strokeWidth={strokeWidth}
          elements={elements}
          setElements={updateElements}
        />
        
        <PageNavigator
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
        />
        
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
