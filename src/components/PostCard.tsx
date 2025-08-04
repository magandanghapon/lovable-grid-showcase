import { Card, CardContent } from "@/components/ui/card";

interface PostCardProps {
  title: string;
  image: string;
  category?: string;
  date?: string;
}

const PostCard = ({ title, image, category, date }: PostCardProps) => {
  return (
    <Card className="group cursor-pointer overflow-hidden bg-gradient-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          {category && (
            <span className="inline-block rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              {category}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {date && (
            <p className="text-xs text-muted-foreground">{date}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;