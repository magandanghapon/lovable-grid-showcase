import Header from "@/components/Header";
import PostsGrid from "@/components/PostsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PostsGrid />
      </main>
    </div>
  );
};

export default Index;
