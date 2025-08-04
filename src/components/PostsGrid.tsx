import PostCard from "./PostCard";
import post1 from "@/assets/post-1.jpg";
import post2 from "@/assets/post-2.jpg";
import post3 from "@/assets/post-3.jpg";
import post4 from "@/assets/post-4.jpg";
import post5 from "@/assets/post-5.jpg";
import post6 from "@/assets/post-6.jpg";

const mockPosts = [
  {
    id: 1,
    title: "Modern Design Principles for Web Development",
    image: post1,
    category: "Design",
    date: "March 15, 2024"
  },
  {
    id: 2,
    title: "Creating the Perfect Workspace for Maximum Productivity",
    image: post2,
    category: "Lifestyle",
    date: "March 12, 2024"
  },
  {
    id: 3,
    title: "Architecture and Urban Planning in the Modern Era",
    image: post3,
    category: "Architecture",
    date: "March 10, 2024"
  },
  {
    id: 4,
    title: "The Art of Digital Abstract Design and Color Theory",
    image: post4,
    category: "Art",
    date: "March 8, 2024"
  },
  {
    id: 5,
    title: "Essential Tech Tools for Remote Work Success",
    image: post5,
    category: "Technology",
    date: "March 5, 2024"
  },
  {
    id: 6,
    title: "Finding Peace and Inspiration in Natural Landscapes",
    image: post6,
    category: "Nature",
    date: "March 3, 2024"
  },
  {
    id: 7,
    title: "Minimalist Web Design Trends to Watch in 2024",
    image: post1,
    category: "Design",
    date: "March 1, 2024"
  },
  {
    id: 8,
    title: "Building Sustainable Creative Habits",
    image: post2,
    category: "Lifestyle",
    date: "February 28, 2024"
  },
  {
    id: 9,
    title: "The Future of Smart Architecture and IoT Integration",
    image: post3,
    category: "Architecture",
    date: "February 25, 2024"
  },
  {
    id: 10,
    title: "Digital Art Revolution: NFTs and Creative Expression",
    image: post4,
    category: "Art",
    date: "February 22, 2024"
  },
  {
    id: 11,
    title: "Emerging Technologies Shaping Our Digital Future",
    image: post5,
    category: "Technology",
    date: "February 20, 2024"
  },
  {
    id: 12,
    title: "Conservation Photography and Environmental Awareness",
    image: post6,
    category: "Nature",
    date: "February 18, 2024"
  }
];

const PostsGrid = () => {
  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Latest Posts</h2>
          <p className="text-muted-foreground">Discover our latest articles and insights</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockPosts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              image={post.image}
              category={post.category}
              date={post.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PostsGrid;