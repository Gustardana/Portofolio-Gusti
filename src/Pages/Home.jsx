import React, { useState, useEffect, useCallback, memo } from "react"
import { Helmet } from "react-helmet-async"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles, Youtube, ShoppingCart, Video } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'

const StatusBadge = memo(() => (
  <div className="relative z-50 flex justify-start mb-6 mt-28 md:mt-10" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group inline-block">
      {/* Glow/bayangan biru di belakang */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-full blur opacity-40 group-hover:opacity-70 transition duration-1000"></div>
      <div className="relative px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center">
        {/* Teks dengan gradien biru */}
        <span className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-transparent bg-clip-text text-xs sm:text-sm font-bold flex items-center">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#00F2FE]" />
          Ready to Innovate
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Tech
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] bg-clip-text text-transparent">
          Enthusiasts
        </span>
      </span>
    </h1>
  </div>
));

// PERBAIKAN: Menghapus hidden sm:block agar Tech Stack muncul di ponsel
const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 rounded-full bg-[#030014]/5 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-gray-300 hover:bg-[#030014]/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4FACFE]/20 to-[#00F2FE]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link, label }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <button className="group relative p-3" aria-label={label}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Content Creator", "Tech Enthusiast", "IT Consultant", "System Engineer Beginner"];
const TECH_STACK = ["Linux", "Docker", "Python", "PostgreSQL", "Git", "AWS"];

const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/gustardana", label: "GitHub Profile" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/gustardana/", label: "LinkedIn Profile" },
  { icon: Instagram, link: "https://www.instagram.com/gustardana/?hl=id", label: "Instagram Profile" },
  { icon: Youtube, link: "https://youtube.com/@gustardana", label: "YouTube Channel" },
  { icon: Video, link: "https://tiktok.com/@gustardana", label: "TikTok Profile" },
  { icon: ShoppingCart, link: "https://lynk.id/gustardana", label: "Store Link" }
];

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <>
      <Helmet>
        <title>Muhammad Gusti Rivaldi — Tech Enthusiast</title>
        <meta name="description" content="Website resmi Muhammad Gusti Rivaldi, Front-End Web Developer. Saya berfokus pada penciptaan pengalaman digital yang menarik dan selalu berupaya memberikan solusi terbaik dalam setiap proyek yang saya kerjakan." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://gustardana.com" />
        <meta property="og:title" content="Muhammad Gusti Rivaldi — Frontend Web Developer" />
        <meta property="og:description" content="Website resmi dan portofolio Muhammad Gusti Rivaldi, Front-End Web Developer." />
        <meta property="og:url" content="https://gustardana.com" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Muhammad Gusti Rivaldi",
            "jobTitle": "Frontend Developer",
            "url": "https://gustardana.com",
            "sameAs": [
              "https://github.com/gustardana",
              "https://www.linkedin.com/in/gustardana/",
              "https://www.instagram.com/gustardana/",
              "https://youtube.com/@gustardana",
              "https://tiktok.com/@gustardana",
              "https://lynk.id/gustardana"
            ]
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-[#030014] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <div className="container mx-auto min-h-screen">
            {/* PERBAIKAN: Mengubah h-screen menjadi min-h-screen lg:h-screen & menyesuaikan gap serta padding */}
            <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen lg:h-screen pt-20 lg:pt-0 md:justify-between gap-8 sm:gap-12 lg:gap-20">
              
              {/* Left Column */}
              <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
                data-aos="fade-right"
                data-aos-delay="200">
                <div className="space-y-4 sm:space-y-6">
                  <StatusBadge />
                  <MainTitle />

                  {/* Typing Effect */}
                  <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                    <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                      {text}
                    </span>
                    <span className="w-[3px] h-6 bg-gradient-to-t from-[#4FACFE] to-[#00F2FE] ml-1 animate-blink"></span>
                  </div>

                  {/* Description */}
                  <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                    data-aos="fade-up"
                    data-aos-delay="1000">
                    Becoming a bridge between technology and life through system design & development.
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                    {TECH_STACK.map((tech, index) => (
                      <TechStack key={index} tech={tech} />
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-row gap-3 w-full justify-start relative z-50" data-aos="fade-up" data-aos-delay="1400">
                    <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                    <CTAButton href="#Contact" text="Contact" icon={Mail} />
                  </div>

                  {/* Social Links */}
                  {/* PERBAIKAN: Mengubah hidden sm:flex menjadi flex flex-wrap serta menambahkan relative z-50 */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 justify-start relative z-50 pb-4 sm:pb-0" data-aos="fade-up" data-aos-delay="1600">
                    {SOCIAL_LINKS.map((social, index) => (
                      <SocialLink key={index} {...social} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - WebM Video */}
              <div
                className="w-full py-5 md:py-[10%] lg:w-1/2 min-h-[260px] sm:min-h-[400px] lg:h-[600px] xl:h-[750px] relative flex items-center justify-center order-2 lg:order-2 mt-5 sm:mt-0"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                data-aos="fade-left"
                data-aos-delay="600"
              >
                <div className="relative w-full opacity-90">

                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-[#4FACFE]/10 to-[#00F2FE]/10 rounded-3xl blur-3xl transition-all duration-700 ease-in-out ${isHovering ? "opacity-50 scale-105" : "opacity-20 scale-100"}`}>
                  </div>

                  {/* Animation GIF Container */}
                  <div className={`relative lg:left-12 z-10 w-full opacity-90 transform transition-transform duration-500 ${isHovering ? "scale-105" : "scale-100"}`}>
                    <img
                      src="Animation1.gif"
                      alt="Developer Animation"
                      className={`w-full h-auto max-h-[300px] sm:max-h-[500px] object-contain transition-all duration-500 ${isHovering
                        ? "scale-[95%] sm:scale-[90%] rotate-2"
                        : "scale-[90%] sm:scale-[80%]"
                        }`}
                    />
                  </div>

                  {/* Pulse Effect */}
                  <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${isHovering ? "opacity-50" : "opacity-20"}`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-blue-500/10 to-blue-500/10 blur-3xl animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] transition-all duration-700 ${isHovering ? "scale-110" : "scale-100"}`}>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Home);