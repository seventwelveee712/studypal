export interface AIConcept {
  id: string;
  title: string;
  category: 'llm' | 'rag' | 'agent' | 'prompt' | 'embedding' | 'fine-tuning';
  categoryLabel: string;
  summary: string;
  description: string;
  keyPoints: string[];
  applications: string[];
  advantages: string[];
  challenges: string[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'paper' | 'course' | 'tool' | 'documentation';
  author?: string;
  source?: string;
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  category: string;
  metrics: Metric[];
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  rank: 'excellent' | 'good' | 'average' | 'poor';
}

export interface AIUseCase {
  id: string;
  title: string;
  industry: string;
  description: string;
  problem: string;
  solution: string;
  benefits: string[];
  technologies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetUsers: string[];
  userNeeds: string[];
  painPoints: string[];
  productFeatures: string[];
  successMetrics: string[];
  implementationSteps: string[];
  challenges: string[];
  caseExamples: string[];
}

export interface AICaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  technology: string;
  results: Result[];
  lessons: string[];
}

export interface Result {
  metric: string;
  value: string;
  comparison?: string;
}

export const aiConcepts: AIConcept[] = [
  {
    id: 'llm',
    title: '大语言模型 (LLM)',
    category: 'llm',
    categoryLabel: '基础模型',
    summary: '大语言模型是基于Transformer架构的深度学习模型，能够理解和生成人类语言。',
    description: '大语言模型（Large Language Model, LLM）是一类基于Transformer架构的人工智能模型，通过海量文本数据训练，能够理解、生成和预测人类语言。代表性模型包括GPT系列、LLaMA、Claude等。LLM具有上下文理解、多任务学习、少样本学习等核心能力，是当前AI应用的基础技术。',
    keyPoints: [
      '基于Transformer架构，采用自监督学习',
      '具备上下文理解和长文本处理能力',
      '支持少样本/零样本学习',
      '能够生成连贯、自然的文本',
      '可进行推理、总结、翻译等多种任务'
    ],
    applications: ['智能对话系统', '内容生成', '代码助手', '知识问答', '机器翻译', '数据分析'],
    advantages: ['通用性强，可迁移到多种任务', '上下文理解能力出色', '生成质量高', '学习能力强'],
    challenges: ['计算资源需求大', '存在幻觉问题', '知识更新滞后', '长上下文处理困难'],
    resources: [
      { id: '1', title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762', type: 'paper', author: 'Vaswani et al.', source: 'NeurIPS 2017' },
      { id: '2', title: 'GPT-4 Technical Report', url: 'https://arxiv.org/abs/2303.08774', type: 'paper', author: 'OpenAI', source: 'arXiv' },
      { id: '3', title: 'LLaMA: Open and Efficient Foundation Language Models', url: 'https://arxiv.org/abs/2302.13971', type: 'paper', author: 'Meta AI', source: 'arXiv' }
    ]
  },
  {
    id: 'rag',
    title: '检索增强生成 (RAG)',
    category: 'rag',
    categoryLabel: '检索增强',
    summary: 'RAG将信息检索与生成模型结合，提升回答的准确性和可追溯性。',
    description: '检索增强生成（Retrieval-Augmented Generation, RAG）是一种AI架构模式，将信息检索系统与生成模型相结合。在生成回答之前，RAG系统先从外部知识库中检索相关文档，然后将这些文档作为上下文提供给生成模型，从而生成更加准确、可追溯的回答。RAG有效解决了LLM的知识过时和幻觉问题。',
    keyPoints: [
      '结合检索系统与生成模型',
      '外部知识库提供最新信息',
      '回答可追溯到源文档',
      '减少幻觉问题',
      '支持领域特定知识'
    ],
    applications: ['企业知识库问答', '文档助手', '客服机器人', '医疗诊断支持', '法律文档分析'],
    advantages: ['知识可更新', '回答可验证', '减少幻觉', '领域适应性强'],
    challenges: ['检索准确性影响结果', '文档处理开销', '长文档处理'],
    resources: [
      { id: '1', title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', url: 'https://arxiv.org/abs/2005.11401', type: 'paper', author: 'Lewis et al.', source: 'NeurIPS 2020' },
      { id: '2', title: 'RAG vs Fine-tuning: Which is Better for Your Use Case?', url: 'https://towardsdatascience.com', type: 'article', source: 'Towards Data Science' }
    ]
  },
  {
    id: 'agent',
    title: 'AI Agent (智能代理)',
    category: 'agent',
    categoryLabel: '智能代理',
    summary: 'AI Agent能够自主感知环境、制定计划、执行任务并学习改进。',
    description: 'AI Agent是一种能够自主感知环境、制定计划、执行任务并学习改进的人工智能系统。Agent具备目标导向的行为能力，能够理解用户意图，分解复杂任务，调用工具获取信息，并反思执行结果。代表性框架包括AutoGPT、BabyAGI、LangChain等。',
    keyPoints: [
      '具备自主决策能力',
      '能够分解复杂任务',
      '支持工具调用',
      '具备反思和迭代能力',
      '目标导向的行为模式'
    ],
    applications: ['自动化办公助手', '代码生成工具', '科研辅助', '教育辅导', '自动化测试'],
    advantages: ['高度自动化', '任务分解能力强', '适应性强', '持续学习改进'],
    challenges: ['任务规划复杂', '长期记忆管理', '安全性和可靠性'],
    resources: [
      { id: '1', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', url: 'https://arxiv.org/abs/2210.03629', type: 'paper', author: 'Yao et al.', source: 'ICML 2023' },
      { id: '2', title: 'LangChain Documentation', url: 'https://python.langchain.com', type: 'documentation', source: 'LangChain' }
    ]
  },
  {
    id: 'prompt',
    title: '提示词工程 (Prompt Engineering)',
    category: 'prompt',
    categoryLabel: '工程方法',
    summary: '通过设计优化的提示词，引导AI模型产生高质量输出的艺术和科学。',
    description: '提示词工程是通过设计和优化提示词来引导AI模型产生期望输出的过程。好的提示词能够充分发挥模型能力，包括明确任务要求、提供示例、设定角色、控制格式等技巧。提示词工程是充分发挥LLM能力的关键技能。',
    keyPoints: [
      '明确任务目标和约束',
      '提供适当的上下文',
      '使用示例示范（Few-shot）',
      '设定角色和风格',
      '结构化输出格式'
    ],
    applications: ['优化AI输出质量', '定制化任务处理', '多模态生成', '代码生成优化'],
    advantages: ['无需训练即可提升效果', '快速迭代', '成本低', '灵活性高'],
    challenges: ['需要领域知识', '效果不稳定', '长提示词开销'],
    resources: [
      { id: '1', title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai', type: 'course', source: 'Prompt Engineering Guide' },
      { id: '2', title: 'Best Practices for Prompt Engineering', url: 'https://platform.openai.com/docs/guides/prompt-engineering', type: 'article', source: 'OpenAI' }
    ]
  },
  {
    id: 'embedding',
    title: '文本嵌入 (Embedding)',
    category: 'embedding',
    categoryLabel: '基础技术',
    summary: '将文本转换为高维向量，用于语义相似度计算和信息检索。',
    description: '文本嵌入是将文本转换为数值向量的过程，这些向量捕捉了文本的语义信息。通过嵌入模型，可以计算文本之间的相似度，支持语义搜索、聚类分析、推荐系统等应用。常用的嵌入模型包括Sentence-BERT、OpenAI Embeddings等。',
    keyPoints: [
      '将文本映射到向量空间',
      '保留语义信息',
      '支持相似度计算',
      '维度通常在768-1536之间',
      '可用于检索、聚类、分类'
    ],
    applications: ['语义搜索', '推荐系统', '文档聚类', '文本分类', '重复检测'],
    advantages: ['语义理解能力强', '计算效率高', '可扩展性好'],
    challenges: ['领域适配需要微调', '长文本处理', '向量存储开销'],
    resources: [
      { id: '1', title: 'Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks', url: 'https://arxiv.org/abs/1908.10084', type: 'paper', author: 'Reimers et al.', source: 'EMNLP 2019' }
    ]
  },
  {
    id: 'fine-tuning',
    title: '模型微调 (Fine-tuning)',
    category: 'fine-tuning',
    categoryLabel: '优化方法',
    summary: '在特定任务数据集上进一步训练预训练模型，提升任务特定性能。',
    description: '模型微调是在预训练模型基础上，使用特定任务的标注数据进行进一步训练的过程。通过微调，可以使通用模型适应特定领域或任务，获得更好的性能。微调通常包括全参数微调、LoRA、Adapter等方法。',
    keyPoints: [
      '利用预训练知识',
      '适应特定任务',
      '需要标注数据',
      '有多种微调策略',
      '平衡泛化性和特异性'
    ],
    applications: ['领域适配', '特定任务优化', '性能提升', '定制化模型'],
    advantages: ['提升任务性能', '保留通用能力', '灵活性高'],
    challenges: ['数据需求', '计算资源', '过拟合风险'],
    resources: [
      { id: '1', title: 'LoRA: Low-Rank Adaptation of Large Language Models', url: 'https://arxiv.org/abs/2106.09685', type: 'paper', author: 'Hu et al.', source: 'ICLR 2022' },
      { id: '2', title: 'Parameter-Efficient Fine-Tuning of Large Language Models', url: 'https://arxiv.org/abs/2303.15647', type: 'paper', source: 'arXiv' }
    ]
  }
];

export const aiCapabilities: AICapability[] = [
  {
    id: 'gpt4',
    name: 'GPT-4',
    description: 'OpenAI推出的大型语言模型，具备强大的多模态理解能力',
    category: '通用模型',
    metrics: [
      { name: '参数规模', value: 100, unit: 'B+', rank: 'excellent' },
      { name: '上下文窗口', value: 128, unit: 'K tokens', rank: 'excellent' },
      { name: '推理能力', value: 95, unit: '评分', rank: 'excellent' },
      { name: '代码能力', value: 92, unit: '评分', rank: 'excellent' },
      { name: '多模态', value: 1, unit: '支持', rank: 'excellent' }
    ]
  },
  {
    id: 'claude3',
    name: 'Claude 3',
    description: 'Anthropic推出的AI模型，以安全性和长上下文著称',
    category: '通用模型',
    metrics: [
      { name: '参数规模', value: 180, unit: 'B+', rank: 'excellent' },
      { name: '上下文窗口', value: 200, unit: 'K tokens', rank: 'excellent' },
      { name: '推理能力', value: 93, unit: '评分', rank: 'excellent' },
      { name: '代码能力', value: 88, unit: '评分', rank: 'good' },
      { name: '多模态', value: 1, unit: '支持', rank: 'excellent' }
    ]
  },
  {
    id: 'llama3',
    name: 'LLaMA 3',
    description: 'Meta开源的大型语言模型，支持商用',
    category: '开源模型',
    metrics: [
      { name: '参数规模', value: 70, unit: 'B', rank: 'good' },
      { name: '上下文窗口', value: 128, unit: 'K tokens', rank: 'excellent' },
      { name: '推理能力', value: 88, unit: '评分', rank: 'good' },
      { name: '代码能力', value: 85, unit: '评分', rank: 'good' },
      { name: '开源商用', value: 1, unit: '支持', rank: 'excellent' }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google推出的多模态AI模型，强调推理和安全性',
    category: '通用模型',
    metrics: [
      { name: '参数规模', value: 100, unit: 'B+', rank: 'excellent' },
      { name: '上下文窗口', value: 128, unit: 'K tokens', rank: 'excellent' },
      { name: '推理能力', value: 90, unit: '评分', rank: 'excellent' },
      { name: '代码能力', value: 87, unit: '评分', rank: 'good' },
      { name: '多模态', value: 1, unit: '支持', rank: 'excellent' }
    ]
  },
  {
    id: 'qwen',
    name: 'Qwen (通义千问)',
    description: '阿里云推出的大语言模型，支持中文优化',
    category: '国产模型',
    metrics: [
      { name: '参数规模', value: 72, unit: 'B', rank: 'good' },
      { name: '上下文窗口', value: 128, unit: 'K tokens', rank: 'excellent' },
      { name: '推理能力', value: 85, unit: '评分', rank: 'good' },
      { name: '中文能力', value: 95, unit: '评分', rank: 'excellent' },
      { name: '开源商用', value: 1, unit: '支持', rank: 'excellent' }
    ]
  },
  {
    id: 'ernie',
    name: 'ERNIE 4.0',
    description: '百度文心一言4.0，专注中文场景优化',
    category: '国产模型',
    metrics: [
      { name: '参数规模', value: 100, unit: 'B+', rank: 'excellent' },
      { name: '上下文窗口', value: 32, unit: 'K tokens', rank: 'average' },
      { name: '推理能力', value: 86, unit: '评分', rank: 'good' },
      { name: '中文能力', value: 96, unit: '评分', rank: 'excellent' },
      { name: '多模态', value: 1, unit: '支持', rank: 'excellent' }
    ]
  }
];

export const aiUseCases: AIUseCase[] = [
  {
    id: 'uc1',
    title: '智能客服助手',
    industry: '客户服务',
    description: '基于AI的智能客服系统，自动回答用户问题，处理常见咨询，实现7x24小时不间断服务。',
    problem: '传统客服成本高、响应慢、重复性工作多、夜间无人值守、服务质量参差不齐',
    solution: '部署RAG增强的对话系统，结合企业知识库提供准确回答，支持多轮对话和意图识别',
    benefits: ['降低人力成本60%以上', '24/7全天候服务', '一致性回答质量', '秒级响应时间', '减少人工工作量'],
    technologies: ['LLM', 'RAG', '意图识别', '多轮对话', '知识图谱'],
    difficulty: 'intermediate',
    targetUsers: ['企业客服团队', '电商平台', '金融机构', ' SaaS服务商'],
    userNeeds: ['快速响应客户咨询', '降低运营成本', '提升客户满意度', '标准化服务流程'],
    painPoints: ['客服人力成本高', '高峰期排队等待', '知识更新不及时', '培训周期长'],
    productFeatures: ['智能问答引擎', '知识库管理', '多渠道接入', '数据分析看板', '工单系统集成'],
    successMetrics: ['问题解决率', '平均响应时间', '客户满意度', '成本节约率', '首次解决率'],
    implementationSteps: ['需求分析', '知识库构建', '模型训练', '测试上线', '迭代优化'],
    challenges: ['知识库质量', '多轮对话理解', '个性化回复', '系统稳定性'],
    caseExamples: ['某银行智能客服系统，问题解决率92%', '某电商平台节省客服成本60%']
  },
  {
    id: 'uc2',
    title: '代码生成助手',
    industry: '软件开发',
    description: 'AI辅助代码生成，提升开发效率和代码质量，支持多种编程语言和框架。',
    problem: '重复编码工作耗时、新手学习曲线陡峭、代码风格不统一、调试困难',
    solution: '基于LLM的代码补全和生成工具，支持上下文理解和代码分析',
    benefits: ['开发效率提升40%', '代码质量改善', '知识传承加速', '新手入门更快'],
    technologies: ['LLM', '代码嵌入', '代码分析', '静态分析', '代码优化'],
    difficulty: 'advanced',
    targetUsers: ['软件开发工程师', '技术团队', '编程学习者', '企业研发部门'],
    userNeeds: ['提高编码效率', '学习新技术', '代码审查辅助', '代码文档生成'],
    painPoints: ['重复代码编写', 'API文档查阅耗时', '调试困难', '代码规范不一致'],
    productFeatures: ['智能代码补全', '代码解释', '重构建议', '测试用例生成', '文档生成'],
    successMetrics: ['代码生成准确率', '开发时间减少', '代码审查通过率', '测试覆盖率'],
    implementationSteps: ['代码库分析', '模型微调', 'IDE集成', '用户测试', '反馈优化'],
    challenges: ['代码安全性', '上下文理解', '多语言支持', '性能优化'],
    caseExamples: ['某科技公司代码生成准确率85%', '某开源项目代码质量提升30%']
  },
  {
    id: 'uc3',
    title: '医疗诊断辅助',
    industry: '医疗健康',
    description: 'AI辅助医生进行疾病诊断和治疗方案推荐，提升诊断准确性。',
    problem: '医疗资源不均衡、诊断准确性依赖经验、误诊率高、基层医生水平有限',
    solution: '结合医学知识库和病历分析，提供诊断建议和治疗方案推荐',
    benefits: ['诊断准确率提升15%', '减轻医生负担', '标准化诊疗流程', '医疗资源均衡'],
    technologies: ['LLM', 'RAG', '医学知识图谱', '影像分析', '数据挖掘'],
    difficulty: 'advanced',
    targetUsers: ['医生', '医疗机构', '医疗AI企业', '医保系统'],
    userNeeds: ['辅助诊断决策', '减少误诊', '学习提升', '科研辅助'],
    painPoints: ['病例信息繁杂', '最新研究难跟踪', '诊断标准不统一', '患者数据隐私'],
    productFeatures: ['智能诊断建议', '病历分析', '文献检索', '治疗方案推荐', '数据可视化'],
    successMetrics: ['诊断准确率', '误诊率降低', '医生满意度', '治疗效果提升'],
    implementationSteps: ['医学数据收集', '知识图谱构建', '模型训练', '临床验证', '监管审批'],
    challenges: ['数据隐私保护', '医学伦理', '模型可解释性', '临床验证'],
    caseExamples: ['某三甲医院诊断准确率96%', '基层医院误诊率降低70%']
  },
  {
    id: 'uc4',
    title: '教育个性化辅导',
    industry: '教育',
    description: 'AI驱动的个性化学习助手，根据学生特点定制学习路径和内容。',
    problem: '传统教育难以实现个性化、学习效率低、缺乏针对性辅导、学习动力不足',
    solution: '分析学习数据，提供个性化学习建议、自适应内容推荐和进度跟踪',
    benefits: ['学习效果提升40%', '个性化学习体验', '即时反馈', '学习路径优化'],
    technologies: ['LLM', '知识图谱', '学习分析', '推荐系统', 'NLP'],
    difficulty: 'intermediate',
    targetUsers: ['学生', '教师', '教育机构', '在线教育平台'],
    userNeeds: ['个性化学习', '学习进度管理', '学习效果评估', '学习内容推荐'],
    painPoints: ['大班教学缺乏个性化', '学习内容不匹配', '学习进度难以跟踪', '缺乏即时反馈'],
    productFeatures: ['学习诊断', '个性化路径', '智能答疑', '进度跟踪', '成就系统'],
    successMetrics: ['学习完成率', '成绩提升幅度', '学习时长', '用户活跃度'],
    implementationSteps: ['学习数据采集', '用户画像构建', '推荐模型', '内容适配', '效果评估'],
    challenges: ['学习动机维持', '内容质量保证', '数据隐私', '公平性'],
    caseExamples: ['某在线教育平台学习完成率提升40%', '某学校学生成绩提升25%']
  },
  {
    id: 'uc5',
    title: '金融风险评估',
    industry: '金融',
    description: 'AI辅助金融机构进行风险评估和决策，提升风控能力。',
    problem: '风险评估复杂、人工判断主观性强、数据量大难以处理、时效性要求高',
    solution: '基于历史数据和实时信息进行智能风险分析和预测',
    benefits: ['风险识别准确率提升20%', '自动化审批', '实时监控', '合规支持'],
    technologies: ['LLM', '数据分析', '风控模型', '异常检测', '知识图谱'],
    difficulty: 'advanced',
    targetUsers: ['银行', '保险', '证券', '风控部门'],
    userNeeds: ['风险识别', '信用评估', '反欺诈', '合规检测'],
    painPoints: ['数据孤岛', '规则难以更新', '误报率高', '合规压力'],
    productFeatures: ['智能风控引擎', '实时监控', '风险报告', '预警系统', '合规检查'],
    successMetrics: ['风险识别率', '误报率', '审批效率', '损失减少'],
    implementationSteps: ['数据整合', '模型训练', '系统集成', '测试验证', '上线监控'],
    challenges: ['数据质量', '模型可解释性', '实时性要求', '监管合规'],
    caseExamples: ['某银行欺诈识别率提升30%', '某保险理赔效率提升50%']
  },
  {
    id: 'uc6',
    title: '内容创作辅助',
    industry: '媒体娱乐',
    description: 'AI辅助内容创作，包括写作、设计、视频制作等多个领域。',
    problem: '内容创作成本高、周期长、创意枯竭、人力不足',
    solution: 'AI辅助生成创意、文案、图像、视频等多模态内容',
    benefits: ['创作效率提升3倍', '创意拓展', '成本降低', '内容多样性'],
    technologies: ['LLM', '多模态生成', '图像生成', '视频生成', '语音合成'],
    difficulty: 'beginner',
    targetUsers: ['内容创作者', '营销团队', '媒体机构', '广告公司'],
    userNeeds: ['创意激发', '文案撰写', '图像生成', '视频制作'],
    painPoints: ['创意枯竭', '写作效率低', '设计能力不足', '内容同质化'],
    productFeatures: ['创意生成', '文案写作', '图像生成', '视频剪辑', '内容分析'],
    successMetrics: ['内容产出量', '创作时间', '内容质量', '用户 Engagement'],
    implementationSteps: ['需求分析', '工具选型', '模型微调', '内容审核', '迭代优化'],
    challenges: ['内容原创性', '风格一致性', '版权问题', '质量控制'],
    caseExamples: ['某媒体平台内容产出提升200%', '某品牌营销效果提升150%']
  }
];

export const aiCaseStudies: AICaseStudy[] = [
  {
    id: 'case1',
    title: '某大型银行智能客服系统',
    company: '某国有银行',
    industry: '金融',
    challenge: '客服需求激增，人力成本压力大，客户等待时间长',
    solution: '部署基于RAG的智能客服系统，整合10000+业务文档',
    technology: 'GPT-4 + RAG + 意图识别',
    results: [
      { metric: '客服效率提升', value: '60%', comparison: 'vs 人工' },
      { metric: '客户等待时间', value: '<3秒', comparison: 'vs 平均3分钟' },
      { metric: '问题解决率', value: '92%', comparison: 'vs 人工85%' }
    ],
    lessons: ['数据质量是关键', '需要持续优化知识库', '人机协作模式更有效']
  },
  {
    id: 'case2',
    title: '教育平台个性化学习助手',
    company: '某在线教育平台',
    industry: '教育',
    challenge: '学生学习效果参差不齐，难以实现个性化教学',
    solution: 'AI驱动的学习分析和个性化推荐系统',
    technology: 'LLM + 知识图谱 + 学习分析',
    results: [
      { metric: '学习完成率', value: '提升40%', comparison: 'vs 传统模式' },
      { metric: '学生满意度', value: '95%', comparison: '问卷调研' },
      { metric: '教师工作量', value: '减少30%', comparison: 'vs 传统模式' }
    ],
    lessons: ['个性化推荐需要迭代优化', '数据隐私保护很重要', '透明度提升信任度']
  },
  {
    id: 'case3',
    title: '医疗影像辅助诊断系统',
    company: '某三甲医院',
    industry: '医疗',
    challenge: '影像诊断依赖专家经验，基层医院资源不足',
    solution: 'AI辅助影像分析和诊断建议系统',
    technology: '多模态LLM + 医学影像模型',
    results: [
      { metric: '诊断准确率', value: '96%', comparison: 'vs 资深医生' },
      { metric: '诊断时间', value: '<5分钟', comparison: 'vs 人工30分钟' },
      { metric: '漏诊率', value: '降低70%', comparison: 'vs 传统模式' }
    ],
    lessons: ['医学AI需要严格验证', '医生参与至关重要', '可解释性是关键']
  }
];

export const categoryIcons: Record<string, string> = {
  llm: '🧠',
  rag: '🔍',
  agent: '🤖',
  prompt: '✍️',
  embedding: '📊',
  fine_tuning: '⚙️'
};
