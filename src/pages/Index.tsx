
import { BookOpen, Puzzle } from "lucide-react";
import { Link } from "react-router-dom";

const ToolCard = ({ title, description, icon: Icon, href, isComingSoon = false }: {
  title: string;
  description: string;
  icon: typeof Puzzle;
  href: string;
  isComingSoon?: boolean;
}) => (
  <Link
    to={isComingSoon ? "#" : href}
    className={`glass-card hover-lift rounded-xl p-6 flex flex-col items-center text-center gap-4 ${
      isComingSoon ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-chip text-chip-foreground">
      {isComingSoon ? "Coming Soon" : "Available Now"}
    </span>
  </Link>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container py-6">
          <h1 className="text-2xl font-bold">Chipzio</h1>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <section className="text-center mb-16 animate-fade-down">
            <span className="inline-block mb-4 px-3 py-1 rounded-full text-sm font-medium bg-chip text-chip-foreground">
              Online Entrepreneur Tools
            </span>
            <h1 className="text-4xl font-bold mb-4">
              Create Engaging Content with Ease
            </h1>
            <p className="text-xl text-muted-foreground">
              Professional tools to help you build and grow your online business
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6 animate-fade-up">
            <ToolCard
              title="Kids Book Tools"
              description="Create engaging educational content for children's books"
              icon={BookOpen}
              href="/kids-tools"
            />
            <ToolCard
              title="Social Media Tools"
              description="Generate captivating social media content"
              icon={Puzzle}
              href="/social-tools"
              isComingSoon
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
