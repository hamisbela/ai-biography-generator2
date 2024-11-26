import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Coffee, Check, Sparkles, UserCircle, Brain, Share2 } from 'lucide-react';
import { genAI } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SupportBox = () => (
  <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
    <div className="text-center space-y-4">
      <Coffee className="h-12 w-12 mx-auto text-blue-500" />
      <h2 className="text-2xl font-bold">Support Our Work ❤️</h2>
      <p className="text-gray-600 max-w-xl mx-auto">
        Help us maintain and improve our AI tools by supporting our API & hosting costs. 
        Your contribution helps keep this tool free for everyone! 🙏
      </p>
      <a
        href="https://roihacks.gumroad.com/coffee"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <Button 
          size="lg" 
          className="text-lg px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          <Coffee className="mr-2 h-5 w-5" />
          Buy Us a Coffee ☕
        </Button>
      </a>
    </div>
  </Card>
);

export default function Home() {
  const [bioInfo, setBioInfo] = useState('');
  const [bioType, setBioType] = useState('professional');
  const [biography, setBiography] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBiography = async () => {
    if (!bioInfo.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      if (!genAI) {
        throw new Error("API key not configured. Please add your Gemini API key to continue.");
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = bioType === 'professional' 
        ? `Create a professional biography based on the following information: ${bioInfo}. 
           The biography should be formal, highlight achievements, and be suitable for professional platforms like LinkedIn or company websites.
           Include relevant accomplishments, experience, and expertise. Keep it between 150-300 words.`
        : `Create an engaging social media bio based on the following information: ${bioInfo}.
           The bio should be concise, engaging, and perfect for platforms like Twitter, Instagram, or TikTok.
           Make it catchy and memorable while highlighting key aspects. Keep it under 160 characters.`;
      
      const result = await model.generateContent(prompt);
      setBiography(result.response.text().trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the biography');
      setBiography('');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(biography);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 py-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text leading-tight">
            AI Biography Generator ✨
          </h1>
          <p className="text-xl text-gray-600">
            Create professional biographies and social media bios in seconds! 🚀
          </p>
        </div>
        
        <div className="gradient-border mb-8">
          <div className="p-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Biography Type
                </label>
                <Select
                  value={bioType}
                  onValueChange={setBioType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select biography type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional Biography</SelectItem>
                    <SelectItem value="social">Social Media Bio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="✍️ Enter information about the person (education, experience, achievements, interests...)..."
                value={bioInfo}
                onChange={(e) => setBioInfo(e.target.value)}
                className="min-h-[200px] text-lg border-2 focus:border-blue-400"
              />
              
              <Button 
                onClick={generateBiography}
                disabled={loading || !bioInfo.trim()}
                className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Biography...
                  </>
                ) : (
                  <>
                    <UserCircle className="mr-2 h-5 w-5" />
                    Generate Biography ✨
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {biography && (
          <div className="space-y-6 mb-12">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Your Biography</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 hover:bg-blue-50"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="prose prose-blue max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {biography}
                  </ReactMarkdown>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 mb-16">
          <article className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
              Free AI Biography Generator: Create Professional Bios in Seconds ⚡
            </h2>
            
            <div className="space-y-8">
              <p className="text-gray-600 leading-relaxed">
                Looking to create a compelling professional biography or social media bio? Our AI-powered
                biography generator helps you craft the perfect bio for any platform, from LinkedIn to
                Twitter, personal websites to company profiles.
              </p>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-500" />
                  Why Choose Our AI Biography Generator? 🎯
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">🚀</span>
                    <span>Instant professional and social media bios</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🤖</span>
                    <span>AI-powered personalization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">📝</span>
                    <span>Multiple bio formats and styles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">💡</span>
                    <span>Platform-optimized content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✨</span>
                    <span>Free to use with professional results</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="h-6 w-6 text-blue-500" />
                  Perfect for Every Platform 📱
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li>• LinkedIn Profiles</li>
                  <li>• Twitter/X Bios</li>
                  <li>• Instagram Bios</li>
                  <li>• Company Websites</li>
                  <li>• Personal Websites</li>
                  <li>• Speaker Introductions</li>
                  <li>• Author Bios</li>
                  <li>• Professional Portfolios</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">
                  Features of Our Biography Generator 🌟
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li>• Professional tone adjustment</li>
                  <li>• Platform-specific formatting</li>
                  <li>• Achievement highlighting</li>
                  <li>• Keyword optimization</li>
                  <li>• Personal brand emphasis</li>
                  <li>• Character count optimization</li>
                  <li>• Multiple style options</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">
                  Tips for Better Biographies 💡
                </h2>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>Include key achievements and expertise</li>
                  <li>Highlight unique value proposition</li>
                  <li>Keep it concise and focused</li>
                  <li>Use industry-relevant keywords</li>
                  <li>Maintain a professional tone</li>
                </ol>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">
                  Why Professional Bios Matter 🎯
                </h2>
                <p className="text-gray-600">
                  A well-crafted biography is essential for:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Personal branding</li>
                  <li>• Professional networking</li>
                  <li>• Career advancement</li>
                  <li>• Online presence</li>
                  <li>• Credibility building</li>
                </ul>
              </div>
            </div>
          </article>
        </div>

        <SupportBox />
      </div>
    </div>
  );
}