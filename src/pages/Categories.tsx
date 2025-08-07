import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  image_urls?: string[];
  created_at: string;
  user_id: string;
}

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  // Group posts by category
  const groupedPosts = posts?.reduce((acc, post) => {
    const category = post.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {} as Record<string, Post[]>) || {};

  const categories = Object.keys(groupedPosts).sort();
  
  // Filter posts based on selected category
  const filteredGroupedPosts = selectedCategory === "all" 
    ? groupedPosts 
    : { [selectedCategory]: groupedPosts[selectedCategory] || [] };
  
  const displayCategories = selectedCategory === "all" 
    ? categories 
    : [selectedCategory];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-destructive">Error loading posts: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground mb-6">
            Explore posts organized by category
          </p>
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-muted-foreground">No posts found.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {displayCategories.map((category) => (
              <section key={category}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl capitalize">
                      {category}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {filteredGroupedPosts[category].length} post{filteredGroupedPosts[category].length !== 1 ? 's' : ''}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGroupedPosts[category].map((post) => (
                        <PostCard
                          key={post.id}
                          id={post.id}
                          title={post.title}
                          image={post.image_url || post.image_urls?.[0] || "/placeholder.svg"}
                          category={post.category}
                          date={new Date(post.created_at).toLocaleDateString()}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Categories;