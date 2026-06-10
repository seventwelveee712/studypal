import fs from 'fs';
import path from 'path';

export interface LearningGoal {
  id: string;
  title: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  estimatedHours: number;
  skills: string[];
  prerequisites: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool' | 'documentation';
  description: string;
}

export interface LearningStep {
  id: string;
  goalId: string;
  order: number;
  title: string;
  description: string;
  estimatedHours: number;
  resources: LearningResource[];
  completed: boolean;
  completedAt?: string;
}

export interface LearningPath {
  id: string;
  goalId: string;
  goalTitle: string;
  steps: LearningStep[];
  createdAt: string;
  lastUpdatedAt: string;
  progress: number;
}

const DATA_DIR = path.join(process.cwd(), 'data', 'learning-paths');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEARNING_GOALS: LearningGoal[] = [
  {
    id: 'frontend-beginner',
    title: '前端开发入门',
    category: 'beginner',
    description: '学习HTML、CSS、JavaScript基础知识，能够创建简单的网页',
    estimatedHours: 40,
    skills: ['HTML', 'CSS', 'JavaScript', 'DOM操作'],
    prerequisites: []
  },
  {
    id: 'frontend-react',
    title: 'React开发进阶',
    category: 'intermediate',
    description: '掌握React框架，能够开发复杂的单页应用',
    estimatedHours: 60,
    skills: ['React', 'Hooks', 'Redux', 'TypeScript'],
    prerequisites: ['frontend-beginner']
  },
  {
    id: 'frontend-advanced',
    title: '前端架构师',
    category: 'advanced',
    description: '深入理解前端工程化、性能优化、架构设计',
    estimatedHours: 80,
    skills: ['性能优化', '微前端', '工程化', '架构设计'],
    prerequisites: ['frontend-react']
  },
  {
    id: 'backend-node',
    title: 'Node.js后端开发',
    category: 'intermediate',
    description: '学习Node.js服务端开发，能够搭建RESTful API',
    estimatedHours: 50,
    skills: ['Node.js', 'Express', 'MongoDB', 'API设计'],
    prerequisites: ['frontend-beginner']
  },
  {
    id: 'fullstack',
    title: '全栈开发',
    category: 'advanced',
    description: '掌握前后端开发技能，能够独立完成全栈项目',
    estimatedHours: 100,
    skills: ['React', 'Node.js', '数据库', '部署运维'],
    prerequisites: ['frontend-react', 'backend-node']
  },
  {
    id: 'ai-basics',
    title: 'AI基础入门',
    category: 'beginner',
    description: '了解人工智能基础概念和常用算法',
    estimatedHours: 30,
    skills: ['机器学习', '深度学习', 'Python', '数据分析'],
    prerequisites: []
  },
  {
    id: 'ai-advanced',
    title: 'AI进阶应用',
    category: 'advanced',
    description: '深入学习深度学习框架，能够构建AI模型',
    estimatedHours: 80,
    skills: ['PyTorch', 'TensorFlow', 'NLP', '计算机视觉'],
    prerequisites: ['ai-basics']
  },
  {
    id: 'data-analysis',
    title: '数据分析入门',
    category: 'beginner',
    description: '学习数据分析基本方法和工具',
    estimatedHours: 35,
    skills: ['Python', 'Pandas', '数据可视化', '统计学'],
    prerequisites: []
  },
  {
    id: 'system-design',
    title: '系统设计',
    category: 'expert',
    description: '掌握大型系统设计方法论和实践',
    estimatedHours: 60,
    skills: ['分布式系统', '高可用', '缓存策略', '设计模式'],
    prerequisites: ['fullstack']
  },
  {
    id: 'cloud-native',
    title: '云原生开发',
    category: 'expert',
    description: '学习云原生技术栈，掌握容器化和微服务',
    estimatedHours: 50,
    skills: ['Docker', 'Kubernetes', '微服务', 'DevOps'],
    prerequisites: ['backend-node']
  },
  {
    id: 'ai-product-manager',
    title: 'AI产品经理',
    category: 'intermediate',
    description: '掌握AI产品设计方法论，能够规划AI产品路线',
    estimatedHours: 40,
    skills: ['需求分析', 'AI技术理解', '产品规划', '数据分析'],
    prerequisites: []
  },
  {
    id: 'ai-product-strategy',
    title: 'AI产品战略',
    category: 'advanced',
    description: '深入学习AI产品战略规划，掌握AI产品落地方法论',
    estimatedHours: 60,
    skills: ['市场分析', '竞争策略', 'AI技术选型', '商业化路径'],
    prerequisites: ['ai-product-manager']
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt工程',
    category: 'beginner',
    description: '学习如何编写高效的AI提示词，提升AI使用效率',
    estimatedHours: 20,
    skills: ['提示词设计', '上下文管理', '多轮对话', '优化技巧'],
    prerequisites: []
  },
  {
    id: 'ai-agent-design',
    title: 'AI Agent设计',
    category: 'advanced',
    description: '掌握AI智能体设计方法，构建自主决策的AI系统',
    estimatedHours: 55,
    skills: ['Agent架构', '工具调用', '长记忆', '任务规划'],
    prerequisites: ['prompt-engineering', 'ai-basics']
  }
];

const GOAL_STEPS: Record<string, Omit<LearningStep, 'id' | 'goalId' | 'completed' | 'completedAt'>[]> = {
  'frontend-beginner': [
    { 
      order: 1, 
      title: 'HTML基础', 
      description: '学习HTML标签、语义化、表单等基础知识', 
      estimatedHours: 8, 
      resources: [
        { id: 'html-mdn', title: 'MDN HTML教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML', type: 'documentation', description: 'Mozilla官方HTML文档，涵盖所有HTML标签和属性' },
        { id: 'html-w3', title: 'W3Schools HTML', url: 'https://www.w3schools.com/html/', type: 'course', description: '适合初学者的HTML入门教程，包含大量示例' },
        { id: 'html-css', title: 'HTML & CSS 设计与构建网站', url: 'https://www.oreilly.com/library/view/html-css-design/9781118206558/', type: 'book', description: '经典的HTML/CSS入门书籍' }
      ]
    },
    { 
      order: 2, 
      title: 'CSS基础', 
      description: '学习CSS选择器、布局、样式等基础知识', 
      estimatedHours: 12, 
      resources: [
        { id: 'css-mdn', title: 'MDN CSS教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS', type: 'documentation', description: 'Mozilla官方CSS文档，全面覆盖CSS特性' },
        { id: 'flexbox', title: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/', type: 'tool', description: '通过游戏学习Flexbox布局' },
        { id: 'css-tricks', title: 'CSS-Tricks', url: 'https://css-tricks.com/', type: 'article', description: '优秀的CSS技巧和教程网站' },
        { id: 'grid-game', title: 'Grid Garden', url: 'https://cssgridgarden.com/', type: 'tool', description: '通过游戏学习CSS Grid布局' }
      ]
    },
    { 
      order: 3, 
      title: 'JavaScript基础', 
      description: '学习JavaScript变量、函数、循环等基础语法', 
      estimatedHours: 12, 
      resources: [
        { id: 'js-mdn', title: 'MDN JavaScript教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', type: 'documentation', description: 'Mozilla官方JavaScript文档' },
        { id: 'js-info', title: 'JavaScript.info', url: 'https://zh.javascript.info/', type: 'course', description: '现代JavaScript教程，涵盖ES6+特性' },
        { id: 'js-30', title: 'JavaScript30', url: 'https://javascript30.com/', type: 'course', description: '30个JavaScript实战项目' }
      ]
    },
    { 
      order: 4, 
      title: 'DOM操作', 
      description: '学习如何使用JavaScript操作HTML文档', 
      estimatedHours: 8, 
      resources: [
        { id: 'dom-mdn', title: 'MDN DOM教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model', type: 'documentation', description: 'Mozilla官方DOM文档' },
        { id: 'dom-article', title: 'DOM操作详解', url: 'https://javascript.info/document', type: 'article', description: 'JavaScript.info的DOM操作章节' }
      ]
    }
  ],
  'frontend-react': [
    { 
      order: 1, 
      title: 'React基础', 
      description: '学习React组件、Props、State等核心概念', 
      estimatedHours: 15, 
      resources: [
        { id: 'react-docs', title: 'React官方文档', url: 'https://react.dev/', type: 'documentation', description: 'React官方教程，最新版本' },
        { id: 'react-tutorial', title: 'React入门教程', url: 'https://zh-hans.react.dev/learn', type: 'course', description: '官方入门学习路径' },
        { id: 'react-video', title: 'React基础视频教程', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'video', description: 'freeCodeCamp的React入门视频' }
      ]
    },
    { 
      order: 2, 
      title: 'React Hooks', 
      description: '深入学习useState、useEffect等Hooks', 
      estimatedHours: 10, 
      resources: [
        { id: 'hooks-docs', title: 'React Hooks文档', url: 'https://react.dev/reference/react', type: 'documentation', description: 'React官方Hooks参考文档' },
        { id: 'hooks-guide', title: 'Hooks完全指南', url: 'https://javascript.info/react-hooks', type: 'article', description: '详细的Hooks使用指南' }
      ]
    },
    { 
      order: 3, 
      title: '状态管理', 
      description: '学习Redux或Context进行状态管理', 
      estimatedHours: 15, 
      resources: [
        { id: 'redux-docs', title: 'Redux官方文档', url: 'https://redux.js.org/', type: 'documentation', description: 'Redux官方文档' },
        { id: 'react-context', title: 'React Context API', url: 'https://react.dev/reference/react/useContext', type: 'documentation', description: 'React官方Context文档' },
        { id: 'zustand', title: 'Zustand', url: 'https://zustand-demo.pmnd.rs/', type: 'tool', description: '轻量级状态管理库' }
      ]
    },
    { 
      order: 4, 
      title: 'TypeScript', 
      description: '学习TypeScript类型系统', 
      estimatedHours: 10, 
      resources: [
        { id: 'ts-docs', title: 'TypeScript官方文档', url: 'https://www.typescriptlang.org/docs/', type: 'documentation', description: 'TypeScript官方文档' },
        { id: 'ts-course', title: 'TypeScript入门教程', url: 'https://javascript.info/typescript', type: 'course', description: 'JavaScript.info的TypeScript教程' }
      ]
    },
    { 
      order: 5, 
      title: '项目实战', 
      description: '完成一个完整的React项目', 
      estimatedHours: 10, 
      resources: [
        { id: 'react-project', title: 'React项目实战', url: 'https://github.com/gothinkster/react-realworld-example-app', type: 'tool', description: 'RealWorld项目示例' }
      ]
    }
  ],
  'backend-node': [
    { 
      order: 1, 
      title: 'Node.js基础', 
      description: '学习Node.js运行时和模块系统', 
      estimatedHours: 10, 
      resources: [
        { id: 'node-docs', title: 'Node.js官方文档', url: 'https://nodejs.org/zh-cn/docs/', type: 'documentation', description: 'Node.js官方文档' },
        { id: 'node-course', title: 'Node.js入门教程', url: 'https://javascript.info/nodejs', type: 'course', description: 'JavaScript.info的Node.js教程' }
      ]
    },
    { 
      order: 2, 
      title: 'Express框架', 
      description: '学习Express构建Web服务器', 
      estimatedHours: 15, 
      resources: [
        { id: 'express-docs', title: 'Express官方文档', url: 'https://expressjs.com/zh-cn/', type: 'documentation', description: 'Express官方文档' },
        { id: 'express-course', title: 'Express教程', url: 'https://www.tutorialspoint.com/expressjs/', type: 'course', description: 'Express入门教程' }
      ]
    },
    { 
      order: 3, 
      title: '数据库', 
      description: '学习MongoDB或MySQL数据库操作', 
      estimatedHours: 15, 
      resources: [
        { id: 'mongo-docs', title: 'MongoDB官方文档', url: 'https://www.mongodb.com/docs/', type: 'documentation', description: 'MongoDB官方文档' },
        { id: 'mysql-docs', title: 'MySQL官方文档', url: 'https://dev.mysql.com/doc/', type: 'documentation', description: 'MySQL官方文档' },
        { id: 'prisma', title: 'Prisma ORM', url: 'https://www.prisma.io/docs', type: 'tool', description: '现代化数据库ORM工具' }
      ]
    },
    { 
      order: 4, 
      title: 'API设计', 
      description: '学习RESTful API设计原则', 
      estimatedHours: 10, 
      resources: [
        { id: 'rest-guide', title: 'RESTful API设计指南', url: 'https://restfulapi.net/', type: 'article', description: 'RESTful API设计最佳实践' },
        { id: 'api-design', title: 'API设计最佳实践', url: 'https://blog.restcase.com/6-api-design-best-practices/', type: 'article', description: 'API设计六大最佳实践' }
      ]
    }
  ],
  'ai-basics': [
    { 
      order: 1, 
      title: 'Python基础', 
      description: '学习Python编程语言', 
      estimatedHours: 10, 
      resources: [
        { id: 'python-docs', title: 'Python官方文档', url: 'https://docs.python.org/zh-cn/3/', type: 'documentation', description: 'Python官方文档' },
        { id: 'python-course', title: 'Python入门教程', url: 'https://www.runoob.com/python/python-tutorial.html', type: 'course', description: '菜鸟教程Python入门' },
        { id: 'python-video', title: 'Python视频教程', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', type: 'video', description: 'freeCodeCamp的Python入门视频' }
      ]
    },
    { 
      order: 2, 
      title: '机器学习基础', 
      description: '学习监督学习、无监督学习等概念', 
      estimatedHours: 10, 
      resources: [
        { id: 'sklearn-docs', title: 'Scikit-learn文档', url: 'https://scikit-learn.org/stable/', type: 'documentation', description: 'Scikit-learn官方文档' },
        { id: 'ml-course', title: 'Coursera ML课程', url: 'https://www.coursera.org/learn/machine-learning', type: 'course', description: 'Andrew Ng的经典ML课程' },
        { id: 'ml-book', title: '机器学习实战', url: 'https://www.oreilly.com/library/view/machine-learning/9781449369110/', type: 'book', description: '经典机器学习书籍' }
      ]
    },
    { 
      order: 3, 
      title: '深度学习入门', 
      description: '学习神经网络基础概念', 
      estimatedHours: 10, 
      resources: [
        { id: 'tf-docs', title: 'TensorFlow入门教程', url: 'https://www.tensorflow.org/tutorials', type: 'documentation', description: 'TensorFlow官方教程' },
        { id: 'pytorch-docs', title: 'PyTorch教程', url: 'https://pytorch.org/tutorials/', type: 'documentation', description: 'PyTorch官方教程' },
        { id: 'dl-book', title: '深度学习', url: 'https://www.deeplearningbook.org/', type: 'book', description: '深度学习圣经' }
      ]
    }
  ],
  'data-analysis': [
    { 
      order: 1, 
      title: 'Python基础', 
      description: '学习Python编程语言', 
      estimatedHours: 8, 
      resources: [
        { id: 'python-data', title: 'Python数据分析入门', url: 'https://www.datacamp.com/courses/intro-to-python-for-data-science', type: 'course', description: 'DataCamp的Python数据分析课程' }
      ]
    },
    { 
      order: 2, 
      title: 'Pandas', 
      description: '学习Pandas数据处理', 
      estimatedHours: 12, 
      resources: [
        { id: 'pandas-docs', title: 'Pandas官方文档', url: 'https://pandas.pydata.org/docs/', type: 'documentation', description: 'Pandas官方文档' },
        { id: 'pandas-cookbook', title: 'Pandas Cookbook', url: 'https://pandas.pydata.org/pandas-docs/stable/user_guide/cookbook.html', type: 'article', description: 'Pandas使用指南' }
      ]
    },
    { 
      order: 3, 
      title: '数据可视化', 
      description: '学习Matplotlib、Seaborn等可视化库', 
      estimatedHours: 10, 
      resources: [
        { id: 'matplotlib-docs', title: 'Matplotlib文档', url: 'https://matplotlib.org/stable/contents.html', type: 'documentation', description: 'Matplotlib官方文档' },
        { id: 'seaborn-docs', title: 'Seaborn文档', url: 'https://seaborn.pydata.org/', type: 'documentation', description: 'Seaborn官方文档' }
      ]
    },
    { 
      order: 4, 
      title: '项目实战', 
      description: '完成一个数据分析项目', 
      estimatedHours: 5, 
      resources: [
        { id: 'kaggle', title: 'Kaggle', url: 'https://www.kaggle.com/', type: 'tool', description: '数据科学竞赛平台' }
      ]
    }
  ],
  'ai-product-manager': [
    { 
      order: 1, 
      title: 'AI技术基础', 
      description: '了解AI基本概念、机器学习、深度学习原理', 
      estimatedHours: 10, 
      resources: [
        { id: 'ai-basics', title: 'AI入门课程', url: 'https://www.coursera.org/courses?query=artificial%20intelligence', type: 'course', description: 'Coursera上的AI入门课程' },
        { id: 'ai-book', title: 'AI产品经理入门', url: 'https://www.amazon.com/AI-Product-Manager-Introduction-Machine/dp/149208168X', type: 'book', description: 'AI产品经理入门书籍' },
        { id: 'ai-101', title: 'AI 101', url: 'https://www.deeplearning.ai/courses/ai-for-everyone/', type: 'course', description: '面向所有人的AI课程' }
      ]
    },
    { 
      order: 2, 
      title: '产品思维培养', 
      description: '学习产品设计方法论、用户研究方法', 
      estimatedHours: 8, 
      resources: [
        { id: 'design-thinking', title: '设计思维', url: 'https://www.interaction-design.org/literature/topics/design-thinking', type: 'article', description: '设计思维方法论' },
        { id: 'ux-design', title: '用户体验设计', url: 'https://www.nngroup.com/articles/ux-design/', type: 'article', description: 'Nielsen Norman Group的UX设计指南' },
        { id: 'product-book', title: '启示录', url: 'https://www.amazon.com/Inspired-Building-Create-Products-Customers/dp/1118968375', type: 'book', description: '产品经理必读经典' }
      ]
    },
    { 
      order: 3, 
      title: 'AI产品案例分析', 
      description: '分析成功的AI产品案例，学习其设计思路', 
      estimatedHours: 8, 
      resources: [
        { id: 'ai-cases', title: 'AI产品案例库', url: 'https://www.producthunt.com/products/tagged/ai', type: 'article', description: 'Product Hunt上的AI产品' },
        { id: 'chatgpt-case', title: 'ChatGPT案例分析', url: 'https://openai.com/research', type: 'article', description: 'OpenAI研究博客' },
        { id: 'midjourney-case', title: 'Midjourney案例', url: 'https://www.midjourney.com/research/', type: 'article', description: 'Midjourney研究页面' }
      ]
    },
    { 
      order: 4, 
      title: 'AI产品原型设计', 
      description: '学习如何设计AI产品的原型和交互', 
      estimatedHours: 8, 
      resources: [
        { id: 'figma', title: 'Figma教程', url: 'https://www.figma.com/learn/', type: 'course', description: 'Figma官方教程' },
        { id: 'ai-design', title: 'AI产品设计指南', url: 'https://uxdesign.cc/designing-ai-products-a-practical-guide-5a8f3a0a4a5a', type: 'article', description: 'AI产品设计实践指南' }
      ]
    },
    { 
      order: 5, 
      title: 'AI产品落地', 
      description: '了解AI产品开发流程、技术选型、项目管理', 
      estimatedHours: 6, 
      resources: [
        { id: 'ai-development', title: 'AI产品开发实战', url: 'https://www.oreilly.com/library/view/building-machine-learning/9781491994757/', type: 'book', description: '机器学习产品开发书籍' },
        { id: 'mlops', title: 'MLOps入门', url: 'https://mlops.community/', type: 'article', description: 'MLOps社区资源' }
      ]
    }
  ],
  'ai-product-strategy': [
    { 
      order: 1, 
      title: '市场分析方法', 
      description: '学习市场调研、竞品分析、用户洞察', 
      estimatedHours: 10, 
      resources: [
        { id: 'market-research', title: '市场调研方法论', url: 'https://www.surveymonkey.com/mp/market-research-methods/', type: 'article', description: '市场调研方法介绍' },
        { id: 'competitive-analysis', title: '竞品分析指南', url: 'https://www.productplan.com/glossary/competitive-analysis/', type: 'article', description: '竞品分析方法' }
      ]
    },
    { 
      order: 2, 
      title: 'AI技术趋势', 
      description: '深入了解AI技术发展趋势和前沿方向', 
      estimatedHours: 12, 
      resources: [
        { id: 'ai-report', title: 'AI技术报告', url: 'https://www.gartner.com/en/articles/what-s-new-in-artificial-intelligence-2024', type: 'article', description: 'Gartner AI技术报告' },
        { id: 'ai-whitepaper', title: '行业白皮书', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai', type: 'article', description: '麦肯锡AI行业报告' },
        { id: 'arxiv', title: 'arXiv', url: 'https://arxiv.org/', type: 'tool', description: '学术论文预印本平台' }
      ]
    },
    { 
      order: 3, 
      title: '产品战略规划', 
      description: '学习如何制定AI产品战略路线图', 
      estimatedHours: 12, 
      resources: [
        { id: 'strategy-book', title: '产品战略管理', url: 'https://www.amazon.com/Good-to-Great-Some-Companies/dp/0066620996', type: 'book', description: '从优秀到卓越' },
        { id: 'roadmap', title: '产品路线图指南', url: 'https://www.productplan.com/guide/product-roadmap-guide/', type: 'article', description: '产品路线图设计指南' }
      ]
    },
    { 
      order: 4, 
      title: '商业化路径', 
      description: '探索AI产品的商业模式和盈利模式', 
      estimatedHours: 12, 
      resources: [
        { id: 'ai-monetization', title: 'AI商业化案例', url: 'https://www.forbes.com/sites/forbestechcouncil/2023/03/16/how-to-monetize-ai-products-effectively/', type: 'article', description: 'AI产品商业化策略' },
        { id: 'saas-book', title: 'SaaS商业模式', url: 'https://www.amazon.com/SaaS-Book-Guide-Building-Software/dp/149207553X', type: 'book', description: 'SaaS商业模式书籍' }
      ]
    },
    { 
      order: 5, 
      title: '团队管理', 
      description: '学习如何管理AI产品团队和跨部门协作', 
      estimatedHours: 8, 
      resources: [
        { id: 'tech-lead', title: '技术团队管理', url: 'https://www.amazon.com/Staff-Engineer-Path-Leadership-Without/dp/149209295X', type: 'book', description: '技术团队管理书籍' },
        { id: 'agile', title: '敏捷开发', url: 'https://www.scrum.org/resources/what-is-scrum', type: 'article', description: 'Scrum敏捷开发方法' }
      ]
    },
    { 
      order: 6, 
      title: '战略实践', 
      description: '完成一个完整的AI产品战略规划项目', 
      estimatedHours: 6, 
      resources: [] 
    }
  ],
  'prompt-engineering': [
    { 
      order: 1, 
      title: '提示词基础', 
      description: '学习提示词的基本结构和设计原则', 
      estimatedHours: 4, 
      resources: [
        { id: 'openai-guide', title: 'OpenAI提示词指南', url: 'https://platform.openai.com/docs/guides/prompt-engineering', type: 'documentation', description: 'OpenAI官方提示词指南' },
        { id: 'prompt-basics', title: '提示词基础教程', url: 'https://www.promptengineering.org/', type: 'course', description: 'Prompt Engineering入门课程' }
      ]
    },
    { 
      order: 2, 
      title: '进阶技巧', 
      description: '学习上下文管理、角色设定、链式思考', 
      estimatedHours: 6, 
      resources: [
        { id: 'prompt-guide', title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'article', description: '全面的提示词工程指南' },
        { id: 'chain-of-thought', title: '链式思考', url: 'https://arxiv.org/abs/2201.11903', type: 'article', description: 'Chain of Thought论文' }
      ]
    },
    { 
      order: 3, 
      title: '多模态提示', 
      description: '学习文本、图像、语音等多模态提示词设计', 
      estimatedHours: 5, 
      resources: [
        { id: 'multimodal', title: '多模态AI教程', url: 'https://openai.com/research/dall-e-3', type: 'article', description: 'DALL-E 3多模态生成' },
        { id: 'gpt4v', title: 'GPT-4V', url: 'https://openai.com/research/gpt-4v-system-card', type: 'article', description: 'GPT-4V技术报告' }
      ]
    },
    { 
      order: 4, 
      title: '优化与测试', 
      description: '学习提示词优化方法和效果评估', 
      estimatedHours: 5, 
      resources: [
        { id: 'prompt-testing', title: '提示词测试方法论', url: 'https://www.evidentlyai.com/blog/prompt-engineering-best-practices', type: 'article', description: '提示词工程最佳实践' }
      ]
    }
  ],
  'ai-agent-design': [
    { 
      order: 1, 
      title: 'Agent架构基础', 
      description: '了解AI Agent的基本架构和组件', 
      estimatedHours: 10, 
      resources: [
        { id: 'agent-arch', title: 'Agent架构设计', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', type: 'article', description: 'Lilian Weng的Agent架构博客' },
        { id: 'agent-paper', title: 'Agent论文', url: 'https://arxiv.org/abs/2308.11432', type: 'article', description: 'Agent相关论文' }
      ]
    },
    { 
      order: 2, 
      title: '工具调用', 
      description: '学习如何让Agent调用外部工具和API', 
      estimatedHours: 12, 
      resources: [
        { id: 'langchain-docs', title: 'LangChain文档', url: 'https://python.langchain.com/docs/get_started/introduction', type: 'documentation', description: 'LangChain官方文档' },
        { id: 'langchain-video', title: 'LangChain教程', url: 'https://www.youtube.com/watch?v=1g02ZJZ82a8', type: 'video', description: 'LangChain入门视频' }
      ]
    },
    { 
      order: 3, 
      title: '长记忆机制', 
      description: '学习Agent的记忆管理和上下文保持', 
      estimatedHours: 10, 
      resources: [
        { id: 'memory-design', title: 'AI记忆系统设计', url: 'https://lilianweng.github.io/posts/2023-01-27-the-memory-of-llm/', type: 'article', description: 'LLM记忆系统博客' },
        { id: 'vector-db', title: '向量数据库', url: 'https://www.pinecone.io/learn/vector-database/', type: 'article', description: '向量数据库入门' }
      ]
    },
    { 
      order: 4, 
      title: '任务规划', 
      description: '学习复杂任务的分解和规划方法', 
      estimatedHours: 12, 
      resources: [
        { id: 'task-planning', title: '任务规划算法', url: 'https://arxiv.org/abs/2305.14325', type: 'article', description: '任务规划论文' },
        { id: 'planning-video', title: 'AI规划教程', url: 'https://www.youtube.com/watch?v=Z1lH1p9b480', type: 'video', description: 'AI规划视频教程' }
      ]
    },
    { 
      order: 5, 
      title: 'Agent实战', 
      description: '构建一个完整的AI Agent应用', 
      estimatedHours: 11, 
      resources: [
        { id: 'agent-example', title: 'Agent示例项目', url: 'https://github.com/hwchase17/langchain/tree/master/examples', type: 'tool', description: 'LangChain示例项目' }
      ]
    }
  ]
};

export function getAllGoals(): LearningGoal[] {
  return LEARNING_GOALS;
}

export function getGoalById(id: string): LearningGoal | undefined {
  return LEARNING_GOALS.find(g => g.id === id);
}

export async function generatePath(goalId: string): Promise<LearningPath> {
  const goal = LEARNING_GOALS.find(g => g.id === goalId);
  if (!goal) {
    throw new Error('目标不存在');
  }

  const steps = (GOAL_STEPS[goalId] || []).map((step, index) => ({
    ...step,
    id: `${goalId}-step-${index + 1}`,
    goalId,
    completed: false
  }));

  const path: LearningPath = {
    id: `path-${goalId}-${Date.now()}`,
    goalId,
    goalTitle: goal.title,
    steps,
    createdAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    progress: 0
  };

  await savePath(path);
  return path;
}

export async function savePath(learningPath: LearningPath): Promise<void> {
  const filePath = path.join(DATA_DIR, `${learningPath.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(learningPath, null, 2));
}

export async function getPaths(): Promise<LearningPath[]> {
  try {
    const files = await fs.promises.readdir(DATA_DIR);
    const paths: LearningPath[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(DATA_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        try {
          paths.push(JSON.parse(content));
        } catch {
          continue;
        }
      }
    }

    return paths.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
  } catch {
    return [];
  }
}

export async function getPathById(id: string): Promise<LearningPath | null> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function updateStep(pathId: string, stepId: string, completed: boolean): Promise<LearningPath | null> {
  const path = await getPathById(pathId);
  if (!path) return null;

  const stepIndex = path.steps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return null;

  path.steps[stepIndex].completed = completed;
  path.steps[stepIndex].completedAt = completed ? new Date().toISOString() : undefined;
  
  const completedCount = path.steps.filter(s => s.completed).length;
  path.progress = Math.round((completedCount / path.steps.length) * 100);
  path.lastUpdatedAt = new Date().toISOString();

  await savePath(path);
  return path;
}

export async function deletePath(id: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await fs.promises.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}