// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of my projects. WIP...",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "My professional experience.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-mlbox-automating-machine-learning-in-python",
      
        title: 'MLBox: Automating Machine Learning in Python <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@ajaymittur/mlbox-automating-machine-learning-in-python-f6779371ae21?source=rss-1fb8a203f419------2", "_blank");
        
      },
    },{id: "news-started-my-master-s-in-ai-at-carnegie-mellon-university-s-language-technologies-institute-school",
          title: 'Started my Master’s in AI at Carnegie Mellon University’s Language Technologies Institute! :school:...',
          description: "",
          section: "News",},{id: "news-graduated-from-carnegie-mellon-university-with-an-ms-in-artificial-intelligence-and-innovation-mortar-board",
          title: 'Graduated from Carnegie Mellon University with an MS in Artificial Intelligence and Innovation!...',
          description: "",
          section: "News",},{id: "news-joined-nvidia-as-an-applied-research-engineer-working-on-llm-post-training-and-agents-for-hardware-design",
          title: 'Joined NVIDIA as an Applied Research Engineer, working on LLM post-training and agents...',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{id: "projects-english-to-french-machine-translation",
          title: 'English to French Machine Translation',
          description: "First LLM project. Used llama-cpp to quantize Llama 2 7B and run it locally on my base macbook air. Did 8-Bit Quantized QLoRA finetuning using HuggingFace TRL library to improve English to French translation of the model",
          section: "Projects",handler: () => {
              window.location.href = "/projects/enfr_llm/";
            },},{id: "projects-generalizable-agents-with-llama-2",
          title: 'Generalizable Agents with Llama 2',
          description: "Used Llama 2 to build a general purpose agent for various tasks from OS to Knowledge Graph environments. Instruction tuning combineed with tree-of-thought sampling on a mixture of environment interaction trajectories and ShareGPT text.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/llm_agent/";
            },},{id: "projects-real-world-movie-recommendation-system",
          title: 'Real-world Movie Recommendation System',
          description: "Built as part of 11-695 Course Project. A scalable movie recommendation system serving 1M+ pseudo users in a fully simulated environment, complete with load balancing, auto scaling, system and model monitoring, and evaluation. Top 3 in class for highest average user ratings of recommended movies. Used SVG, XGBoost, Flask, Docker, Prometheus, Grafana.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/movie_rec/";
            },},{id: "projects-improving-multi-modal-interactions-in-memes",
          title: 'Improving Multi-modal Interactions in Memes',
          description: "Analyzing vision-language interactions in memes and improving multimodal model performances on sentiment classification, caption generation and question-answering.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/multimodal/";
            },},{id: "projects-rag-question-answering-system-on-pittsburgh",
          title: 'RAG Question Answering System on Pittsburgh',
          description: "Built a hybrid retrieval-augmented question answering pipeline on everything Pittsburgh, from scratch (end to end), using LangChain, Mistral, Command-R-Plus, and ChromaDB.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/pitt_rag/";
            },},{id: "projects-llm-agents-for-scientific-discovery",
          title: 'LLM Agents for Scientific Discovery',
          description: "Research with Prof. Graham Neubig (CMU LTI) on LLM agents for novel scientific idea generation, experiment planning, code generation, and paper writing.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/science_agents/";
            },},{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/ajaymittur", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/ajay-mittur", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/ajaymittur", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
