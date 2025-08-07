import Header from "@/components/Header";
import PostsGrid from "@/components/PostsGrid";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {user && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">My Posts</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
        )}
        <main>
          <PostsGrid />
        </main>
      </div>
    </div>
  );
};

export default Index;
