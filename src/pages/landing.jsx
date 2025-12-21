import { useLocation } from "wouter";
import { ArrowRight, Zap, Users, Palette, Wind, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Wind,
      title: "Fluid Drawing",
      description: "Experience smooth, responsive brushstrokes that feel natural and organic, perfectly tuned for creative expression.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Layers,
      title: "Smart Layering",
      description: "Organize your work with intelligent layer management, making it easy to refine and iterate on complex designs.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Palette,
      title: "Custom Palette",
      description: "Build your perfect color scheme with unlimited gradients, patterns, and custom brush styles at your fingertips.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Live Collaboration",
      description: "Create together in real-time. See changes instantly as teammates sketch, brainstorm, and build simultaneously.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Instant Sync",
      description: "Every stroke syncs instantly across devices. No delays, no waiting—just pure creative flow with your team.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: Sparkles,
      title: "Multi-Page Projects",
      description: "Organize your ideas across multiple pages. Switch between concepts seamlessly without losing any of your work.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const useCases = [
    "Product Design",
    "Wireframing",
    "Brainstorming",
    "Team Planning",
    "Creative Writing",
    "Concept Art"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-4 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Inkify" className="w-8 h-8 rounded" />
          <span className="text-xl font-bold">Inkify</span>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="border-white/20 hover:bg-white/10"
            onClick={() => setLocation("/account")}
          >
            Login
          </Button>
          <Button 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            onClick={() => setLocation("/account")}
          >
            Get Started
          </Button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full text-sm font-semibold">
              The Creative Workspace of Tomorrow
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Sketch Together, Create Better
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The next-generation collaborative whiteboard where teams bring their wildest ideas to life. Real-time, seamless, and built for the way you actually work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-6"
                onClick={() => setLocation("/account")}
              >
                Start Creating Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white font-semibold text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free for teams up to 5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Instant setup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Everything You Need to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Create Anything</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Powerful features designed for creators, teams, and organizations who demand excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="group relative p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:border-white/20"
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                    
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-slate-400 mb-12">Whether you're a designer, developer, educator, or entrepreneur, Inkify adapts to your needs.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {useCases.map((useCase, index) => (
                <div 
                  key={index}
                  className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
                >
                  <p className="font-medium text-sm">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-12">
              <h2 className="text-4xl font-bold mb-4">Ready to Create Something Amazing?</h2>
              <p className="text-slate-300 mb-8 text-lg">Join teams worldwide who are sketching, designing, and collaborating on Inkify.</p>
              
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-6"
                onClick={() => setLocation("/account")}
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <p className="text-slate-400 text-sm mt-4">✨ No credit card required • Setup in seconds</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-4 text-center text-slate-400 text-sm">
        <p>&copy; 2024 Inkify. Where ideas take shape, together.</p>
      </footer>
    </div>
  );
}
