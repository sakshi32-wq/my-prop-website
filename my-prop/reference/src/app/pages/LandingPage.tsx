import { Link } from "react-router";
import { 
  Sparkles, 
  LayoutTemplate, 
  MessageSquare, 
  Users, 
  Send, 
  BarChart3, 
  Check,
  ArrowRight,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">myprop.live</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900">How It Works</a>
              <a href="#templates" className="text-slate-600 hover:text-slate-900">Templates</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Platform</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Build & Market Real Estate Projects with AI
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Create stunning property websites, automate lead generation, and convert prospects with AI-powered marketing tools designed for real estate developers and brokers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Book a Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-slate-900">2,500+</div>
                  <div className="text-sm text-slate-600">Active Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">50K+</div>
                  <div className="text-sm text-slate-600">Leads Generated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">98%</div>
                  <div className="text-sm text-slate-600">Customer Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-600">Powerful tools to build, market, and convert real estate leads</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Website Generator",
                description: "Generate complete property websites in minutes with AI. Just add project details and watch magic happen.",
                color: "emerald"
              },
              {
                icon: LayoutTemplate,
                title: "Drag & Drop Builder",
                description: "Customize every section with an intuitive visual builder. No coding required.",
                color: "teal"
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Automation",
                description: "Send personalized WhatsApp campaigns and automate follow-ups with intelligent chatbots.",
                color: "blue"
              },
              {
                icon: Users,
                title: "Lead CRM",
                description: "Manage leads with a visual pipeline. Track interactions, schedule follow-ups, and close deals faster.",
                color: "amber"
              },
              {
                icon: Send,
                title: "Campaign Builder",
                description: "Create multi-channel campaigns with email and WhatsApp. Set triggers and automation flows.",
                color: "purple"
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Track performance with real-time analytics. Measure ROI, conversion rates, and lead sources.",
                color: "rose"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Get started in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Add Your Project Details",
                description: "Enter property information, upload images, and define your target audience."
              },
              {
                step: "02",
                title: "AI Builds Your Site",
                description: "Our AI generates a complete website with copy, layout, and lead capture forms."
              },
              {
                step: "03",
                title: "Capture & Convert Leads",
                description: "Automated campaigns nurture leads through WhatsApp, email, and smart follow-ups."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500" 
                    style={{ width: 'calc(100% - 3rem)', left: '1.5rem' }} 
                  />
                )}
                <div className="relative bg-white rounded-xl p-8 border border-slate-200">
                  <div className="text-6xl font-bold text-emerald-100 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Professional Templates</h2>
            <p className="text-xl text-slate-600">Choose from our library of premium real estate templates</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Project Launch", type: "New Development" },
              { name: "Luxury Tower", type: "High-End Property" },
              { name: "Single Property", type: "Villa/Apartment" },
              { name: "Broker Profile", type: "Personal Brand" }
            ].map((template, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                  <ImageWithFallback 
                    src={`https://images.unsplash.com/photo-${
                      index === 0 ? '1486406146926-c627a92ad1ab' :
                      index === 1 ? '1545324418-cc1a3fa10c00' :
                      index === 2 ? '1512917774080-9991f1c4c750' :
                      '1560518883-ce09059eeffa'
                    }?w=400&h=300&fit=crop`}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-slate-600">{template.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Choose the plan that fits your business</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "₹4,999",
                period: "/month",
                description: "Perfect for individual brokers",
                features: [
                  "3 Active Websites",
                  "500 Leads/month",
                  "WhatsApp & Email Campaigns",
                  "Basic CRM",
                  "AI Content Generation",
                  "Standard Templates"
                ],
                cta: "Start Free Trial",
                popular: false
              },
              {
                name: "Growth",
                price: "₹14,999",
                period: "/month",
                description: "For growing developers",
                features: [
                  "15 Active Websites",
                  "5,000 Leads/month",
                  "Advanced Automation",
                  "Full CRM Suite",
                  "Unlimited AI Generation",
                  "Premium Templates",
                  "Custom Domain",
                  "Priority Support"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations",
                features: [
                  "Unlimited Websites",
                  "Unlimited Leads",
                  "White Label Solution",
                  "Dedicated Account Manager",
                  "Custom Integrations",
                  "API Access",
                  "Advanced Analytics",
                  "24/7 Support"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl p-8 border-2 ${plan.popular ? 'border-emerald-500 shadow-xl' : 'border-slate-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600 mb-2">{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Real Estate Business?</h2>
          <p className="text-xl text-slate-300 mb-8">Join thousands of developers and brokers who are already using myprop.live</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">myprop.live</span>
              </div>
              <p className="text-sm">AI-powered real estate marketing platform</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 myprop.live. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
