import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Loader2, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComparisonSlider from "@/components/ComparisonSlider";
import { removeBackground } from "@imgly/background-removal";

export default function ImageUploader() {
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");

    const handleUpload = async (fileToUpload: File) => {
        setIsUploading(true);
        setProgressMessage("Initializing AI Model...");
        try {
            const resultBlob = await removeBackground(fileToUpload, {
                progress: (key: string, current: number, total: number) => {
                    const percent = Math.round((current / total) * 100);
                    if (key.includes("fetch")) {
                        setProgressMessage(`Downloading AI Model (${percent}%)`);
                    } else if (key.includes("compute")) {
                        setProgressMessage(`Removing Background (${percent}%)`);
                    } else {
                        setProgressMessage("AI Processing...");
                    }
                }
            });

            const processedUrl = URL.createObjectURL(resultBlob);
            setProcessedImageUrl(processedUrl);
        } catch (error) {
            console.error("Failed to remove background:", error);
            toast.error("Failed to remove background. Please try again.");
        } finally {
            setIsUploading(false);
            setProgressMessage("");
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            const fileUrl = URL.createObjectURL(selectedFile);
            setOriginalImageUrl(fileUrl);

            // Call actual processing
            handleUpload(selectedFile);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
        noClick: !!processedImageUrl, // Disable click if showing result
        noKeyboard: !!processedImageUrl,
    });

    const resetUpload = () => {
        setOriginalImageUrl(null);
        setProcessedImageUrl(null);
        setIsUploading(false);
    };

    const handleDownload = () => {
        if (processedImageUrl) {
            const link = document.createElement("a");
            link.href = processedImageUrl;
            link.download = "removed-bg.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Image downloaded successfully!");
        }
    };

    if (processedImageUrl && originalImageUrl) {
        return (
            <div className="w-full max-w-4xl flex flex-col items-center gap-6 mt-8">
                <ComparisonSlider originalImage={originalImageUrl} processedImage={processedImageUrl} />
                <div className="flex gap-4">
                    <Button onClick={resetUpload} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" /> Upload Another
                    </Button>
                    <Button onClick={handleDownload} className="gap-2">
                        <Download className="w-4 h-4" /> Download HD Result
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden relative">
            <div
                {...getRootProps()}
                className={`p-12 border-2 border-dashed rounded-[1.4rem] flex flex-col items-center justify-center transition-colors duration-300 min-h-[350px] m-4
          ${!processedImageUrl ? "cursor-pointer" : ""}
          ${isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50 hover:bg-muted/30"}`}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {!originalImageUrl ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <UploadCloud className="w-10 h-10 text-primary" />
                            </div>
                            <p className="text-xl font-semibold mb-2">Drag & Drop an image here</p>
                            <p className="text-sm text-muted-foreground">or click to browse files</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center w-full"
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center text-primary">
                                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                    <p className="font-medium animate-pulse text-lg">{progressMessage}</p>
                                    <p className="text-sm text-muted-foreground mt-2">Runs 100% privately in your browser</p>
                                </div>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}
