import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Tag, Edit, Trash2, Save, X, Code2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MediaDisplay from "@/components/MediaDisplay";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";
import post5 from "@/assets/post-5.jpg";
import post6 from "@/assets/post-6.jpg";

// Fallback images for posts without image_url
const fallbackImages = [post1, post2, post3, post4, post5, post6];

interface Post {
  id: string;
  title: string;
  category: string;
  image_url: string | null;
  image_urls: string[];
  content: string | null;
  created_at: string;
  user_id: string | null;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Post not found",
            description: "The post you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setPost(data);
        setEditContent(data.content || "");
        setEditCategory(data.category || "");
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to load post. Please try again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPostImages = () => {
    if (post?.image_urls && post.image_urls.length > 0) {
      return post.image_urls;
    }
    if (post?.image_url) {
      return [post.image_url];
    }
    // Use a consistent fallback based on post id
    const index = post?.id ? parseInt(post.id.slice(-1), 16) % fallbackImages.length : 0;
    return [fallbackImages[index]];
  };

  const images = getPostImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDelete = async () => {
    if (!post || !user || post.user_id !== user.id) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!post || !user || post.user_id !== user.id) return;

    try {
      const { error } = await supabase
        .from("posts")
        .update({ 
          content: editContent,
          category: editCategory 
        })
        .eq("id", post.id);

      if (error) throw error;

      setPost({ ...post, content: editContent, category: editCategory });
      setIsEditing(false);
      
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post?.content || "");
    setEditCategory(post?.category || "");
    setIsEditing(false);
  };

  const isOwner = user && post && post.user_id === user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4 w-1/4"></div>
              <div className="aspect-[16/9] bg-muted rounded-lg mb-6"></div>
              <div className="h-10 bg-muted rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>

          <article className="space-y-6">
            {/* Hero Image with Carousel */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <MediaDisplay
                  src={images[currentImageIndex]}
                  alt={`${post.title} - Media ${currentImageIndex + 1}`}
                  className="w-full h-auto object-contain cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
                
                {/* Navigation arrows (only show if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails (only show if multiple images) */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary shadow-lg' 
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      <MediaDisplay
                        src={image}
                        alt={`${post.title} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Carousel */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
                <div className="relative h-full flex flex-col">
                  <Carousel className="flex-1">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="h-[80vh] flex items-center justify-center bg-black">
                            <MediaDisplay
                              src={image}
                              alt={`${post.title} - Media ${index + 1}`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                      </>
                    )}
                  </Carousel>

                  {/* Modal Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto bg-background/80 backdrop-blur">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                        >
                          <MediaDisplay
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Post Header */}
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    {post.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {post.title}
              </h1>
              
              {/* Action buttons for post owner */}
              {isOwner && (
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                        className="flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your post.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveEdit}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              )}
            </header>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none text-foreground">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Category Input */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Enter category..."
                      className="max-w-sm"
                    />
                  </div>
                  
                  {/* Editor Mode Toggle */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      type="button"
                      variant={!isHtmlMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsHtmlMode(false)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Rich Text
                    </Button>
                    <Button
                      type="button"
                      variant={isHtmlMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsHtmlMode(true)}
                      className="flex items-center gap-2"
                    >
                      <Code2 className="w-4 h-4" />
                      HTML Source
                    </Button>
                  </div>

                  {isHtmlMode ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Enter your HTML content here..."
                      className="min-h-[300px] font-mono text-sm"
                      style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                    />
                  ) : (
                    <ReactQuill
                      value={editContent}
                      onChange={setEditContent}
                      theme="snow"
                      placeholder="Write your post content..."
                      className="min-h-[200px] tooltip-editor"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'script': 'sub'}, { 'script': 'super' }],
                          [{ 'indent': '-1'}, { 'indent': '+1' }],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'align': [] }],
                          ['blockquote', 'code-block'],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                      formats={[
                        'header', 'bold', 'italic', 'underline', 'strike',
                        'list', 'bullet', 'script', 'indent',
                        'color', 'background', 'align', 'blockquote', 'code-block',
                        'link', 'image'
                      ]}
                    />
                  )}
                </div>
              ) : (
                post.content ? (
                  <div 
                    className="rich-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <p className="text-muted-foreground italic">
                    This post doesn't have any content yet.
                  </p>
                )
              )}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;