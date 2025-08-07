interface MediaDisplayProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

const MediaDisplay = ({ src, alt, className, onClick }: MediaDisplayProps) => {
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  if (isVideo(src)) {
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