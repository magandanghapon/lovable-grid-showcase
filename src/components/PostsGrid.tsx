import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import AddPostForm from "./AddPostForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  created_at: string;
}

const PostsGrid = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPostImage = (imageUrl: string | null, index: number) => {
    return imageUrl || fallbackImages[index % fallbackImages.length];
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Latest Posts</h2>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Latest Posts</h2>
            <p className="text-muted-foreground">Discover our latest articles and insights</p>
          </div>
          <AddPostForm onPostAdded={fetchPosts} />
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet. Add your first post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                title={post.title}
                image={getPostImage(post.image_url, index)}
                category={post.category}
                date={formatDate(post.created_at)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PostsGrid;