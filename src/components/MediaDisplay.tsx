interface MediaDisplayProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  thumbnail?: boolean;
}

const MediaDisplay = ({ src, alt, className, onClick, thumbnail = false }: MediaDisplayProps) => {
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  if (isVideo(src)) {
    if (thumbnail) {
      return (
        <div className={`${className} relative bg-muted flex items-center justify-center`} onClick={onClick}>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <video className="w-full h-full object-cover" preload="metadata">
            <source src={src} type="video/mp4" />
          </video>
        </div>
      );
    }
    
    return (
      <video
        className={className}
        controls
        onClick={onClick}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
    />
  );
};

export default MediaDisplay;