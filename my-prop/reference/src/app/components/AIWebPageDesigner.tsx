import { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Check, 
  Code2,
  Send,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Eye,
  Download
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

export function AIWebPageDesigner() {
  const [pagePrompt, setPagePrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isGeneratingPage, setIsGeneratingPage] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const examplePrompts = [
    "Create a modern property hero section with gradient background",
    "Design a luxury amenities showcase with image grid",
    "Build a contact form with property inquiry fields",
    "Make a pricing table for different apartment types"
  ];

  const handleSendPrompt = (prompt: string) => {
    setIsGeneratingPage(true);
    const userMsg = prompt;
    setPagePrompt("");
    setTimeout(() => {
      setChatMessages([...chatMessages, 
        { role: 'user', content: userMsg },
        { role: 'assistant', content: `I've created that for you. Check the preview on the right. Let me know if you'd like any changes!` }
      ]);
      setIsGeneratingPage(false);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-320px)] flex flex-col">
      {/* Top Bar with Device Selectors and Code Toggle */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
            className={previewMode === 'desktop' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : ''}
          >
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={previewMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('tablet')}
            className={previewMode === 'tablet' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : ''}
          >
            <Tablet className="w-4 h-4 mr-2" />
            Tablet
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className={previewMode === 'mobile' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : ''}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showCode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className={showCode ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : ''}
          >
            <Code2 className="w-4 h-4 mr-2" />
            {showCode ? 'Show Preview' : 'View Code'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Split View: Chat + Preview */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left: Chat Interface */}
        <div className="flex flex-col border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Describe Your Web Page
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Tell AI what you want to create and watch it build in real-time
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Start Building with AI</h4>
                <p className="text-sm text-slate-600 mb-6">
                  Try one of these example prompts:
                </p>
                <div className="space-y-2">
                  {examplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      className="w-full p-3 text-left rounded-lg border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                      onClick={() => handleSendPrompt(prompt)}
                    >
                      <p className="text-sm font-medium text-slate-700">{prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}

            {isGeneratingPage && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <p className="text-sm text-slate-700">Generating your page...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-2">
              <Textarea
                placeholder="Describe what you want to create or change..."
                value={pagePrompt}
                onChange={(e) => setPagePrompt(e.target.value)}
                className="resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && pagePrompt.trim()) {
                    e.preventDefault();
                    handleSendPrompt(pagePrompt);
                  }
                }}
              />
              <Button
                onClick={() => pagePrompt.trim() && handleSendPrompt(pagePrompt)}
                disabled={!pagePrompt.trim() || isGeneratingPage}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>

        {/* Right: Live Preview or Code */}
        <div className="flex flex-col border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
          {/* Preview Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              {showCode ? (
                <>
                  <Code2 className="w-5 h-5 text-blue-600" />
                  HTML/CSS Code
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 text-emerald-600" />
                  Live Preview
                </>
              )}
            </h3>
            <Badge variant="outline" className="capitalize">
              {previewMode}
            </Badge>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto p-6 bg-slate-50">
            {showCode ? (
              <div className="bg-slate-900 rounded-lg p-6 h-full overflow-auto">
                <pre className="text-emerald-400 text-sm font-mono whitespace-pre-wrap">
{`<div class="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-12 rounded-xl">
  <h1 class="text-4xl font-bold mb-4">
    Welcome to Luxury Living
  </h1>
  <p class="text-xl mb-6">
    Discover your dream home in the heart of Mumbai
  </p>
  <button class="bg-white text-emerald-600 px-8 py-3 rounded-lg font-bold hover:bg-emerald-50">
    Schedule a Visit
  </button>
</div>

<style>
  /* Modern real estate styles */
  .property-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  }
  .property-card:hover {
    transform: translateY(-4px);
  }
</style>`}
                </pre>
              </div>
            ) : (
              <div className={`mx-auto transition-all ${
                previewMode === 'mobile' ? 'max-w-[375px]' :
                previewMode === 'tablet' ? 'max-w-[768px]' :
                'w-full'
              }`}>
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Maximize2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Your generated page will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Mock Preview */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-12 rounded-xl shadow-lg">
                      <h1 className="text-4xl font-bold mb-4">
                        Welcome to Luxury Living
                      </h1>
                      <p className="text-xl mb-6 text-emerald-50">
                        Discover your dream home in the heart of Mumbai's most prestigious location
                      </p>
                      <div className="flex gap-4">
                        <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-all">
                          Schedule a Visit
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all">
                          View Gallery
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: '🏊', title: 'Swimming Pool', desc: 'Olympic size pool' },
                        { icon: '💪', title: 'Fitness Center', desc: 'State-of-the-art gym' },
                        { icon: '🌳', title: 'Garden', desc: 'Landscaped gardens' },
                      ].map((amenity, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200">
                          <div className="text-4xl mb-3">{amenity.icon}</div>
                          <h3 className="font-bold text-slate-900 mb-1">{amenity.title}</h3>
                          <p className="text-sm text-slate-600">{amenity.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="Your Name" />
                        <Input placeholder="Email Address" />
                        <Input placeholder="Phone Number" />
                        <Input placeholder="Preferred Date" />
                      </div>
                      <Textarea placeholder="Your Message" className="mt-4" rows={3} />
                      <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 w-full">
                        Submit Inquiry
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {chatMessages.length > 0 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Page generated successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setChatMessages([]);
                setPagePrompt("");
                setShowCode(false);
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600" size="sm">
              <Check className="w-4 h-4 mr-2" />
              Use This Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}