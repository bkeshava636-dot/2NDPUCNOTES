import { useState, useMemo } from "react";
import { Link } from "wouter";
import { 
  useAdminListCards, 
  useAdminListSections, 
  useAdminDeleteCard, 
  useAdminUpdateCard, 
  getAdminListCardsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  X,
  Sparkles,
  Link2,
  RefreshCw
} from "lucide-react";
import { formatRupees } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCards() {
  const { data: cards, isLoading, isError, error, isFetching, refetch } = useAdminListCards(undefined, {
    query: {
      queryKey: getAdminListCardsQueryKey(),
      retry: 1,
    },
  });
  const { data: sections } = useAdminListSections();
  const deleteCard = useAdminDeleteCard();
  const updateCard = useAdminUpdateCard();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedResourceType, setSelectedResourceType] = useState<string>("all");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCard.mutate({ id: deleteId }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Resource deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
        setDeleteId(null);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
        setDeleteId(null);
      }
    });
  };

  const handleToggleVisibility = (id: number, currentVisible: boolean) => {
    updateCard.mutate({ id, data: { isVisible: !currentVisible } }, {
      onSuccess: () => {
        toast({ title: currentVisible ? "Hidden from store" : "Published to store" });
        queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update visibility", variant: "destructive" });
      }
    });
  };

  const handleToggleFeatured = (id: number, currentFeatured: boolean) => {
    updateCard.mutate({ id, data: { isFeatured: !currentFeatured } }, {
      onSuccess: () => {
        toast({ title: currentFeatured ? "Removed from featured" : "Marked as featured" });
        queryClient.invalidateQueries({ queryKey: getAdminListCardsQueryKey() });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update featured flag", variant: "destructive" });
      }
    });
  };

  // Client-side filtering
  const filteredCards = useMemo(() => {
    if (!cards) return [];
    return cards.filter((card) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        card.title.toLowerCase().includes(q) ||
        (card.subject && card.subject.toLowerCase().includes(q)) ||
        (card.chapter && card.chapter.toLowerCase().includes(q)) ||
        (card.resourceType && card.resourceType.toLowerCase().includes(q)) ||
        (card.subtype && card.subtype.toLowerCase().includes(q))
      );

      // Section filter
      const matchesSection = selectedSection === "all" || String(card.sectionId) === selectedSection;

      // Subject filter
      const matchesSubject = selectedSubject === "all" || (card.subject && card.subject.toLowerCase() === selectedSubject.toLowerCase());

      // Resource Type filter
      const matchesResourceType = selectedResourceType === "all" || (card.resourceType && card.resourceType.toLowerCase() === selectedResourceType.toLowerCase());

      // Subtype filter
      const matchesSubtype = selectedSubtype === "all" || (card.subtype && card.subtype.toLowerCase() === selectedSubtype.toLowerCase());

      // Price filter
      let matchesPrice = true;
      if (selectedPrice === "free") matchesPrice = card.isFree;
      else if (selectedPrice === "paid") matchesPrice = !card.isFree;

      // Status filter
      let matchesStatus = true;
      if (selectedStatus === "visible") matchesStatus = card.isVisible;
      else if (selectedStatus === "hidden") matchesStatus = !card.isVisible;
      else if (selectedStatus === "featured") matchesStatus = card.isFeatured;
      else if (selectedStatus === "recommended") matchesStatus = Boolean(card.isRecommended);
      else if (selectedStatus === "free") matchesStatus = card.isFree;
      else if (selectedStatus === "paid") matchesStatus = !card.isFree;
      else if (selectedStatus === "drive-link") matchesStatus = Boolean(card.pdfFileKey && card.pdfFileKey.startsWith("http"));
      else if (selectedStatus === "pdf-attached") matchesStatus = Boolean(card.pdfFileKey && !card.pdfFileKey.startsWith("http"));
      else if (selectedStatus === "pdf-missing") matchesStatus = !card.pdfFileKey;

      return matchesSearch && matchesSection && matchesSubject && matchesResourceType && matchesSubtype && matchesPrice && matchesStatus;
    });
  }, [cards, searchQuery, selectedSection, selectedSubject, selectedResourceType, selectedSubtype, selectedPrice, selectedStatus]);

  const hasActiveFilters = 
    searchQuery !== "" || 
    selectedSection !== "all" || 
    selectedSubject !== "all" ||
    selectedResourceType !== "all" ||
    selectedSubtype !== "all" ||
    selectedPrice !== "all" ||
    selectedStatus !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSection("all");
    setSelectedSubject("all");
    setSelectedResourceType("all");
    setSelectedSubtype("all");
    setSelectedPrice("all");
    setSelectedStatus("all");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">Resources Management</h1>
            <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
              Manage notes, sample papers, pricing, and downloadable PDFs
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#112542]">Failed to load study resources</h3>
          <p className="text-xs text-[#64748b] mt-1 mb-5">
            {(error as any)?.message || "A network or server error occurred while retrieving resources."}
          </p>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs bg-[#2f74de] hover:bg-[#1f63c8] text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Retry Connection</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#112542] tracking-tight">Resources Management</h1>
          <p className="text-[#5a6b82] text-xs sm:text-sm mt-0.5">
            Manage notes, sample papers, pricing, and downloadable PDFs
          </p>
        </div>
        <Link href="/admin/cards/new">
          <Button className="h-9 gap-1.5 text-xs font-semibold bg-[#2f74de] hover:bg-[#1f63c8] text-white shadow-none transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Resource</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e2e8f0] space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94a3b8]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, chapter..."
              className="pl-9 h-9 text-xs sm:text-sm bg-[#f8fafc] border-[#e2e8f0] text-[#112542] focus-visible:border-[#1856b8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#112542]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Section Filter */}
          <div className="w-full sm:w-44 shrink-0">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {sections?.map((sec) => (
                  <SelectItem key={sec.id} value={String(sec.id)}>
                    {sec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40 shrink-0">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="visible">Visible Only</SelectItem>
                <SelectItem value="hidden">Hidden Only</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="drive-link">Google Drive Links</SelectItem>
                <SelectItem value="pdf-attached">Uploaded PDFs</SelectItem>
                <SelectItem value="pdf-missing">PDF Missing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-xs text-[#5a6b82] hover:text-[#112542] shrink-0"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Secondary Filter Row: Subject, Resource Type, Subtype, Free/Paid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-[#f1f5f9]">
          {/* Subject Filter */}
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-8 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
              <SelectValue placeholder="Subject: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Kannada">Kannada</SelectItem>
              <SelectItem value="Sanskrit">Sanskrit</SelectItem>
            </SelectContent>
          </Select>

          {/* Resource Type Filter */}
          <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
            <SelectTrigger className="h-8 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
              <SelectValue placeholder="Type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resource Types</SelectItem>
              <SelectItem value="Notes">Notes</SelectItem>
              <SelectItem value="Model Question Papers (MQP)">Model Question Papers (MQP)</SelectItem>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="Question Bank">Question Bank</SelectItem>
              <SelectItem value="Practical">Practical</SelectItem>
              <SelectItem value="Previous Year Question Papers (PYQs)">PYQs</SelectItem>
              <SelectItem value="Passing Package">Passing Package</SelectItem>
              <SelectItem value="Publication Books">Publication Books</SelectItem>
            </SelectContent>
          </Select>

          {/* Subtype Filter */}
          <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
            <SelectTrigger className="h-8 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
              <SelectValue placeholder="Subtype: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subtypes</SelectItem>
              <SelectItem value="Midterm">Midterm (PYQ)</SelectItem>
              <SelectItem value="Preparatory">Preparatory (PYQ)</SelectItem>
              <SelectItem value="Annual">Annual (PYQ)</SelectItem>
              <SelectItem value="Scheme">Scheme (Practical)</SelectItem>
              <SelectItem value="Resources">Resources (Practical)</SelectItem>
              <SelectItem value="Lab Manual">Lab Manual (Practical)</SelectItem>
              <SelectItem value="Viva Questions">Viva Questions (Practical)</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Filter */}
          <Select value={selectedPrice} onValueChange={setSelectedPrice}>
            <SelectTrigger className="h-8 text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#112542]">
              <SelectValue placeholder="Price: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
              <SelectItem value="paid">Paid Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Counter Info Row */}
        <div className="flex items-center justify-between text-xs text-[#64748b] pt-1">
          <span>
            Showing <strong className="text-[#112542]">{filteredCards.length}</strong> of{" "}
            <strong className="text-[#112542]">{cards?.length ?? 0}</strong> resources
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] text-[#1856b8] font-medium">Filtered results active</span>
          )}
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-none">
        <Table>
          <TableHeader className="bg-[#f8fafc]">
            <TableRow className="border-[#eef2f6] hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 pl-5">Resource</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Category</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">Price</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3">PDF File</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 text-center">Flags</TableHead>
              <TableHead className="text-xs font-semibold text-[#64748b] py-3 pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#64748b] text-xs">
                  <FileText className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
                  No resources matched your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredCards.map((card) => (
                <TableRow key={card.id} className="border-[#eef2f6] hover:bg-[#f8fafc]/60 transition-colors">
                  {/* Resource Column */}
                  <TableCell className="pl-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden shrink-0 flex items-center justify-center mt-0.5">
                        {card.thumbnailUrl ? (
                          <img src={card.thumbnailUrl} alt={card.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="h-4 w-4 text-[#94a3b8]" />
                        )}
                      </div>
                      <div className="min-w-0 max-w-[280px]">
                        <p className="font-bold text-xs text-[#112542] leading-tight truncate" title={card.title}>
                          {card.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {card.isRecommended && (
                            <span className="text-[9px] font-bold bg-[#0284c7] text-white px-1.5 py-0.2 rounded">
                              Recommended
                            </span>
                          )}
                          {card.subject && (
                            <span className="text-[10px] font-medium bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] px-1.5 py-0.2 rounded">
                              {card.subject}
                            </span>
                          )}
                          {card.subtype && (
                            <span className="text-[10px] font-semibold bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] px-1.5 py-0.2 rounded">
                              {card.subtype}
                            </span>
                          )}
                          {card.chapter && (
                            <span className="text-[10px] text-[#64748b] truncate max-w-[120px]">
                              {card.chapter}
                            </span>
                          )}
                          <span className="text-[10px] text-[#94a3b8] border border-[#e2e8f0] px-1.5 py-0.2 rounded">
                            {card.resourceType}
                          </span>
                          {card.answerKeyUrl && (
                            <span className="text-[9px] font-semibold bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] px-1 py-0.2 rounded" title="Answer key linked">
                              Key Linked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Section Column */}
                  <TableCell className="py-3.5">
                    <span className="text-xs font-medium text-[#475569] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded">
                      {card.sectionName || "Unassigned"}
                    </span>
                  </TableCell>

                  {/* Price Column */}
                  <TableCell className="py-3.5">
                    {card.isFree ? (
                      <span className="text-xs font-bold text-[#16a34a] bg-[#eaf5ec] border border-[#d7ecdc] px-2 py-0.5 rounded inline-block">
                        Free
                      </span>
                    ) : (
                      <div>
                        <div className="text-xs font-bold text-[#112542]">
                          {formatRupees(card.discountPricePaise ?? card.pricePaise)}
                        </div>
                        {card.discountPricePaise && card.discountPricePaise < card.pricePaise && (
                          <div className="text-[10px] text-[#94a3b8] line-through">
                            {formatRupees(card.pricePaise)}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* PDF Column */}
                  <TableCell className="py-3.5">
                    {card.pdfFileKey ? (
                      card.pdfFileKey.startsWith("http") ? (
                        <a
                          href={card.pdfFileKey}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1856b8] bg-[#ebf3ff] border border-[#dce8fa] px-2 py-0.5 rounded hover:bg-[#dce8fa] transition-colors"
                          title="Open Drive link"
                        >
                          <Link2 className="h-3 w-3 text-[#1856b8]" />
                          Drive Link
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#167035] bg-[#eaf5ec] border border-[#d7ecdc] px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3 text-[#167035]" />
                          Attached
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#b83226] bg-[#fdece9] border border-[#f9dcd7] px-2 py-0.5 rounded">
                        <AlertCircle className="h-3 w-3 text-[#b83226]" />
                        Missing
                      </span>
                    )}
                  </TableCell>

                  {/* Flags (Visibility & Featured) */}
                  <TableCell className="py-3.5 text-center">
                    <div className="inline-flex items-center gap-1 bg-[#f8fafc] border border-[#e2e8f0] p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(card.id, card.isVisible)}
                        className={`p-1 rounded transition-colors ${
                          card.isVisible
                            ? "text-[#1856b8] bg-[#ebf3ff]"
                            : "text-[#94a3b8] hover:text-[#112542]"
                        }`}
                        title={card.isVisible ? "Visible to students (Click to hide)" : "Hidden (Click to publish)"}
                        aria-label={card.isVisible ? "Visible" : "Hidden"}
                      >
                        {card.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(card.id, card.isFeatured)}
                        className={`p-1 rounded transition-colors ${
                          card.isFeatured
                            ? "text-amber-500 bg-amber-50"
                            : "text-[#94a3b8] hover:text-[#112542]"
                        }`}
                        title={card.isFeatured ? "Featured resource (Click to unfeature)" : "Not featured (Click to feature)"}
                        aria-label={card.isFeatured ? "Featured" : "Not featured"}
                      >
                        <Star className="h-3.5 w-3.5" fill={card.isFeatured ? "currentColor" : "none"} />
                      </button>
                      {card.isNew && (
                        <span className="text-[10px] font-bold text-red-600 px-1 py-0.5 rounded bg-red-50">
                          NEW
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="pr-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/card/${card.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-[#64748b] hover:text-[#1856b8] rounded-md hover:bg-[#ebf3ff] transition-colors"
                        title="View Public Card"
                        aria-label="View Public Card"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <Link href={`/admin/cards/${card.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-[#64748b] hover:text-[#1856b8] hover:bg-[#ebf3ff]"
                          title="Edit Resource"
                          aria-label="Edit Resource"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-[#64748b] hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(card.id)}
                        title="Delete Resource"
                        aria-label="Delete Resource"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List View (Visible on screens < 768px) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filteredCards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e2e8f0] p-6 text-[#64748b] text-xs">
            <FileText className="h-8 w-8 text-[#cbd5e1] mx-auto mb-2" />
            No resources matched your filters.
          </div>
        ) : (
          filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-[#e2e8f0] rounded-xl p-4 space-y-3 shadow-none"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] overflow-hidden shrink-0 flex items-center justify-center">
                  {card.thumbnailUrl ? (
                    <img src={card.thumbnailUrl} alt={card.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="h-5 w-5 text-[#94a3b8]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs sm:text-sm text-[#112542] leading-tight line-clamp-2">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {card.isRecommended && (
                      <span className="text-[9px] font-bold bg-[#0284c7] text-white px-1.5 py-0.2 rounded">
                        Recommended
                      </span>
                    )}
                    {card.subject && (
                      <span className="text-[10px] font-medium bg-[#ebf3ff] text-[#1856b8] border border-[#dce8fa] px-1.5 py-0.2 rounded">
                        {card.subject}
                      </span>
                    )}
                    {card.subtype && (
                      <span className="text-[10px] font-semibold bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] px-1.5 py-0.2 rounded">
                        {card.subtype}
                      </span>
                    )}
                    <span className="text-[10px] text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-1.5 py-0.2 rounded">
                      {card.sectionName || "Unassigned"}
                    </span>
                    {card.answerKeyUrl && (
                      <span className="text-[9px] font-semibold bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] px-1 py-0.2 rounded">
                        Key Linked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and PDF status row */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#eef2f6]">
                <div>
                  <span className="text-[11px] text-[#64748b] mr-1.5">Price:</span>
                  {card.isFree ? (
                    <span className="font-bold text-[#16a34a]">Free</span>
                  ) : (
                    <span className="font-bold text-[#112542]">
                      {formatRupees(card.discountPricePaise ?? card.pricePaise)}
                    </span>
                  )}
                </div>
                <div>
                  {card.pdfFileKey ? (
                    card.pdfFileKey.startsWith("http") ? (
                      <a href={card.pdfFileKey} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1856b8] hover:underline">
                        <Link2 className="h-3 w-3" /> Drive Link
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#167035]">
                        <CheckCircle2 className="h-3 w-3" /> PDF Ready
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#b83226]">
                      <AlertCircle className="h-3 w-3" /> PDF Missing
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between pt-2 border-t border-[#eef2f6]">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 px-2.5 text-xs gap-1 border-[#e2e8f0] ${
                      card.isVisible ? "text-[#1856b8] bg-[#ebf3ff]" : "text-[#64748b]"
                    }`}
                    onClick={() => handleToggleVisibility(card.id, card.isVisible)}
                  >
                    {card.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    <span>{card.isVisible ? "Visible" : "Hidden"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 px-2 text-xs border-[#e2e8f0] ${
                      card.isFeatured ? "text-amber-500 bg-amber-50" : "text-[#64748b]"
                    }`}
                    onClick={() => handleToggleFeatured(card.id, card.isFeatured)}
                    title="Featured toggle"
                  >
                    <Star className="h-3.5 w-3.5" fill={card.isFeatured ? "currentColor" : "none"} />
                  </Button>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link href={`/admin/cards/${card.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1 border-[#e2e8f0] text-[#112542]">
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    onClick={() => setDeleteId(card.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="border-[#e2e8f0] rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#112542]">
              Delete Study Resource?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#64748b] leading-relaxed">
              This will remove the resource from your public store and delete any associated private PDF storage file. Existing student purchase history will remain intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs h-9 border-[#e2e8f0]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-xs h-9 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
