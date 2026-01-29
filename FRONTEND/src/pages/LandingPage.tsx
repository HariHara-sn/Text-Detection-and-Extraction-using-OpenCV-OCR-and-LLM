import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Upload, 
  FileText, 
  MessageCircle, 
  Download, 
  ArrowRight,
  Shield,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Upload Prescription",
      description: "Snap a photo or upload an image/PDF of your prescription"
    },
    {
      icon: FileText,
      title: "Smart Extraction",
      description: "AI-powered OCR extracts medicine names, dosages, and timings"
    },
    {
      icon: MessageCircle,
      title: "Ask Questions",
      description: "Chat with AI about your medicines, timings, and interactions"
    },
    {
      icon: Download,
      title: "Export Data",
      description: "Download structured JSON for your records or sharing"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your prescriptions are processed locally on your device"
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get extracted data in seconds, not minutes"
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced OCR and natural language understanding"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-hero-gradient opacity-5" />
        
        <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full text-accent-foreground text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Prescription Reader
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Understand Your
              <span className="text-primary block">Prescriptions Instantly</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your prescription image, get structured medication data, and ask any 
              questions about your medicines—all in one place.
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="gap-2 text-lg px-8 py-6"
                asChild
              >
                <Link to="/upload">
                  Upload Prescription
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From prescription image to structured data in seconds
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card rounded-lg p-6 shadow-card-elevated hover:shadow-card-hover transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Use Our<br />
                <span className="text-primary">Prescription Reader?</span>
              </h2>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-2xl p-8 shadow-card-elevated">
                <div className="bg-muted rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                  </div>
                  <pre className="text-xs text-muted-foreground overflow-auto">
{`{
  "medicines": [
    {
      "name": "Paracetamol 500mg",
      "frequency": "1-0-1",
      "timing": {
        "morning": "Yes",
        "afternoon": "No",
        "night": "Yes"
      }
    }
  ]
}`}
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Structured JSON output ready for any use case
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Upload your first prescription and see the magic happen.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="gap-2 text-lg px-8 py-6"
              asChild
            >
              <Link to="/upload">
                Upload Prescription Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            ⚠️ This tool is for informational purposes only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
