"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ShimmerImageProps {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  aspectRatio?: string;
  padding?: string;
  bg?: string;
}

export default function ShimmerImage({
  src,
  alt,
  fallbackSrc = "/default-lock.png",
  className = "",
  containerStyle,
  imageStyle,
  aspectRatio = "4 / 3",
  padding = "16px",
  bg = "#f8fafc",
}: ShimmerImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const imgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setIsLoaded(true);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspectRatio,
        background: bg,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...containerStyle,
      }}
    >
      {/* Shimmer Placeholder Skeleton */}
      {!isLoaded && (
        <div
          className="shimmer-skeleton"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              opacity: 0.3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ImageIcon size={28} style={{ color: "var(--primary)" }} />
          </div>
        </div>
      )}

      {/* Full Image (never cropped) */}
      {currentSrc ? (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={className}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain", // FULL IMAGE - never cropped or cut off
            padding: padding,
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s ease",
            zIndex: 2,
            ...imageStyle,
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            color: "var(--text-muted)",
          }}
        >
          <ImageIcon size={32} style={{ opacity: 0.3 }} />
        </div>
      )}
    </div>
  );
}
