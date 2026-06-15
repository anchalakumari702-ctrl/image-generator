import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Download, Copy, Trash2, Calendar, Palette } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ImageGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const listQuery = trpc.images.list.useQuery({
    limit: 20,
    offset: 0,
  });

  const deleteMutation = trpc.images.delete.useMutation({
    onSuccess: () => {
      toast.success("Image deleted");
      listQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  useEffect(() => {
    if (listQuery.data) {
      setImages(listQuery.data);
    }
  }, [listQuery.data]);

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leonardo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleCopy = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("Image copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy image");
    }
  };

  const handleDelete = (imageId: number) => {
    setDeleteConfirm(null);
    deleteMutation.mutate({ imageId });
  };

  if (listQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="w-8 h-8 text-accent" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <Card className="p-12 text-center border-border/50">
        <div className="space-y-3">
          <p className="text-lg font-medium text-foreground">No images yet</p>
          <p className="text-muted-foreground">
            Generate your first image to get started
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card
            key={image.id}
            className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow duration-300 group"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden bg-muted">
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-black"
                  onClick={() => handleDownload(image.imageUrl, image.prompt)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-black"
                  onClick={() => handleCopy(image.imageUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/90 hover:bg-red-600 text-white"
                  onClick={() => setDeleteConfirm(image.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-4 space-y-3">
              {/* Prompt */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {image.prompt}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" />
                  <span className="capitalize">{image.style}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex gap-2 md:hidden pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8"
                  onClick={() => handleDownload(image.imageUrl, image.prompt)}
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8"
                  onClick={() => handleCopy(image.imageUrl)}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-destructive"
                  onClick={() => setDeleteConfirm(image.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Image</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this image? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Load More Button */}
      {images.length >= 20 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsLoadingMore(true);
              listQuery.refetch().finally(() => setIsLoadingMore(false));
            }}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
