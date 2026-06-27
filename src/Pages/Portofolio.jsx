import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase"; 
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, Briefcase } from "lucide-react"; 

// --- Komponen Toggle Button ---
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-[#030014]/5 
      hover:bg-[#030014]/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

// --- Komponen Card Experience Baru ---
const CardExperience = ({ Img, Title, Source, Link }) => (
  <div className="group relative w-full h-full bg-[#030014]/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
    <div className="relative h-48 w-full overflow-hidden bg-black/50">
      <img src={Img} alt={Title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
    </div>
    <div className="relative p-5 flex flex-col flex-grow bg-gradient-to-b from-white/5 to-transparent">
      <span className="inline-block px-2 py-1 mb-3 text-[10px] font-semibold tracking-wider text-indigo-300 uppercase bg-blue-500/10 border border-blue-500/20 rounded-md w-fit">
        {Source}
      </span>
      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{Title}</h3>
      <div className="mt-auto pt-4">
        <a href={Link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group/link">
          Read / Watch More
          <svg className="w-4 h-4 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  </div>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "linux.png", language: "Linux" },
  { icon: "docker.png", language: "Docker" },
  { icon: "amazon.png", language: "AWS" },
  { icon: "python.png", language: "Python" },
  { icon: "git.png", language: "Git" },
  { icon: "PostgreeSQL.png", language: "PostgreSQL" },
  { icon: "GitHubA.png", language: "GitHub" },
  { icon: "nginx.png", language: "Nginx" },
  { icon: "Kubernetes.png", language: "Kubernetes" },
  { icon: "Notion.png", language: "Notion" },
  { icon: "jira.png", language: "Jira" },
  { icon: "figma.png", language: "Figma" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [filter, setFilter] = useState('All'); // State untuk filter
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]); 
  
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllExperiences, setShowAllExperiences] = useState(false); 
  
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [projectsResponse, certificatesResponse, experiencesResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: false }),
        supabase.from("certificates").select("*").order('id', { ascending: false }), 
        supabase.from("experiences").select("*").order('created_at', { ascending: false }), 
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (certificatesResponse.error) throw certificatesResponse.error;
      if (experiencesResponse.error) throw experiencesResponse.error;

      const projectData = projectsResponse.data || [];
      const certificateData = certificatesResponse.data || [];
      const experienceData = experiencesResponse.data || [];

      setProjects(projectData);
      setCertificates(certificateData);
      setExperiences(experienceData);

      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("certificates", JSON.stringify(certificateData));
      localStorage.setItem("experiences", JSON.stringify(experienceData));
      
      window.dispatchEvent(new Event("portfolioDataUpdated"));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);

  useEffect(() => {
    const cachedProjects = localStorage.getItem('projects');
    const cachedCertificates = localStorage.getItem('certificates');
    const cachedExperiences = localStorage.getItem('experiences');

    if (cachedProjects && cachedCertificates && cachedExperiences) {
        setProjects(JSON.parse(cachedProjects));
        setCertificates(JSON.parse(cachedCertificates));
        setExperiences(JSON.parse(cachedExperiences));
    }
    
    fetchData(); 
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') setShowAllProjects(prev => !prev);
    else if (type === 'certificates') setShowAllCertificates(prev => !prev);
    else if (type === 'experiences') setShowAllExperiences(prev => !prev);
  }, []);

  // Penempatan logika penampil dan filter hanya ditulis satu kali agar tidak error
  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  
  const filteredCertificates = filter === 'All' 
    ? certificates 
    : certificates.filter(cert => cert.category === filter);
    
  const displayedCertificates = showAllCertificates ? filteredCertificates : filteredCertificates.slice(0, initialItems);
  
  const displayedExperiences = showAllExperiences ? experiences : experiences.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]">
          <span style={{
            color: '#4FACFE',
            backgroundImage: 'linear-gradient(45deg, #4FACFE 10%, #00F2FE 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, technical expertise, and media coverage. 
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // Background Cyber-Blue
              background: "linear-gradient(180deg, rgba(79, 172, 254, 0.03) 0%, rgba(0, 242, 254, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth" 
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" }, 
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: { xs: "12px 4px", md: "20px 24px" }, 
                zIndex: 1,
                margin: { xs: "4px", md: "8px" }, 
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  // Hover Cyber-Blue
                  backgroundColor: "rgba(0, 242, 254, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  // Selected state Cyber-Blue
                  background: "linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(0, 242, 254, 0.2)",
                  "& .lucide": {
                    // Icon color menjadi Cyan terang
                    color: "#00F2FE",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: { xs: "2px", md: "8px" },
              },
            }}
          >
            <Tab icon={<Code className="mb-2 w-4 h-4 md:w-5 md:h-5 transition-all duration-300" />} label="Projects" {...a11yProps(0)} />
            <Tab icon={<Award className="mb-2 w-4 h-4 md:w-5 md:h-5 transition-all duration-300" />} label="Certificates" {...a11yProps(1)} />
            <Tab icon={<Briefcase className="mb-2 w-4 h-4 md:w-5 md:h-5 transition-all duration-300" />} label="Experiences" {...a11yProps(2)} />
            <Tab icon={<Boxes className="mb-2 w-4 h-4 md:w-5 md:h-5 transition-all duration-300" />} label="Tech Stack" {...a11yProps(3)} />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          {/* TAB 1: PROJECTS */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5 w-full">
                {displayedProjects.map((project, index) => (
                  <div key={project.id || index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}>
                    <CardProject Img={project.Img} Title={project.Title} Description={project.Description} Link={project.Link} id={project.id} />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => toggleShowMore('projects')} isShowingMore={showAllProjects} />
              </div>
            )}
          </TabPanel>

          {/* TAB 2: CERTIFICATES */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 justify-center">
              {['All', 'Competition', 'Course'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filter === cat 
                      ? 'bg-blue-500/20 border border-blue-500 text-[#00F2FE]' 
                      : 'bg-[#030014]/5 border border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 w-full">
                {displayedCertificates.map((certificate, index) => (
                  <div key={certificate.id || index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}>
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {filteredCertificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => toggleShowMore('certificates')} isShowingMore={showAllCertificates} />
              </div>
            )}
          </TabPanel>

          {/* TAB 3: EXPERIENCE (NEW) */}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {displayedExperiences.map((exp, index) => (
                  <div key={exp.id || index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration="1000">
                    <CardExperience Img={exp.image_url} Title={exp.title} Source={exp.source} Link={exp.url} />
                  </div>
                ))}
                {experiences.length === 0 && (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No experience records available yet.
                  </div>
                )}
              </div>
            </div>
            {experiences.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton onClick={() => toggleShowMore('experiences')} isShowingMore={showAllExperiences} />
              </div>
            )}
          </TabPanel>

          {/* TAB 4: TECH STACK */}
          <TabPanel value={value} index={3} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5 w-full">
                {techStacks.map((stack, index) => (
                  <div key={index} data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}>
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}