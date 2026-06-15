import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";

const STYLES = [
  { value: "realistic", label: "Realistic" },
  { value: "artistic", label: "Artistic" },
  { value: "abstract", label: "Abstract" },
  { value: "cartoon", label: "Cartoon" },
  { value: "oil-painting", label: "Oil Painting" },
  { value: "watercolor", label: "Watercolor" },
];

const ASPECT_RATIOS = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:3", label: "Standard (4:3)" },
  { value: "3:4", label: "Tall (3:4)" },
];

interface GeneratorInterfaceProps {
  onSuccess?: () => void;
}

export default function GeneratorInterface({ onSuccess }: GeneratorInterfaceProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageCount, setImageCount] = useState(1);

  const generateMutation = trpc.images.generate.useMutation({
    onSuccess: () => {
      toast.success("Image generated successfully!");
      setPrompt("");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate image");
    },
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    generateMutation.mutate({
      prompt: prompt.trim(),
      style,
      aspectRatio,
      imageCount,
    });
  };

  const isLoading = generateMutation.isPending;
  const charCount = prompt.length;
  const maxChars = 1000;

  return (
    <Card className="p-8 border-border/50 shadow-lg animate-fade-in">
      <div className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-3 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt" className="text-base font-semibold">
              Describe your image
            </Label>
            <span className="text-xs text-muted-foreground">
              {charCount}/{maxChars}
            </span>
          </div>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, maxChars))}
            placeholder="A serene mountain landscape with golden sunset, misty valleys, and a crystal-clear lake reflecting the sky..."
            className="w-full h-24 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Style */}
          <div className="space-y-2">
            <Label htmlFor="style" className="text-sm font-medium">
              Style
            </Label>
            <Select value={style} onValueChange={setStyle} disabled={isLoading}>
              <SelectTrigger id="style" className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label htmlFor="aspect" className="text-sm font-medium">
              Aspect Ratio
            </Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isLoading}>
              <SelectTrigger id="aspect" className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ar) => (
                  <SelectItem key={ar.value} value={ar.value}>
                    {ar.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Count */}
          <div className="space-y-2">
            <Label htmlFor="count" className="text-sm font-medium">
              Number of Images
            </Label>
            <Select value={imageCount.toString()} onValueChange={(v) => setImageCount(parseInt(v))} disabled={isLoading}>
              <SelectTrigger id="count" className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "image" : "images"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-semibold rounded-lg transition-all"
        >
          {isLoading ? (
            <>
              <Spinner className="w-4 h-4 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Image
            </>
          )}
        </Button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Image generation typically takes 5-30 seconds. Please be patient while we create your masterpiece.
        </p>
      </div>
    </Card>
  );
}
