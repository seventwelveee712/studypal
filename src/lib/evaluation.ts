import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export interface TestQuestion {
  id: string;
  question: string;
  options?: string[];
  expectedAnswer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface EvaluationResult {
  id: string;
  questionId: string;
  userAnswer: string;
  aiAnswer: string;
  score: number;
  feedback: string;
  timestamp: Date;
}

export interface EvaluationSession {
  id: string;
  results: EvaluationResult[];
  totalScore: number;
  correctCount: number;
  timestamp: Date;
}

const TEST_DATA_DIR = path.join(process.cwd(), 'data', 'evaluation');

if (!fs.existsSync(TEST_DATA_DIR)) {
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
}

const sampleQuestions: TestQuestion[] = [
  { 
    id: 'q1', 
    question: '什么是RAG技术？', 
    options: [
      'A. 一种图像识别技术',
      'B. 检索增强生成技术，结合检索和生成',
      'C. 一种数据压缩算法',
      'D. 区块链技术'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q2', 
    question: '解释机器学习中的监督学习', 
    options: [
      'A. 使用未标注数据训练',
      'B. 使用标注数据学习输入输出映射',
      'C. 通过奖励信号学习',
      'D. 自动发现数据模式'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'easy' 
  },
  { 
    id: 'q3', 
    question: 'Transformer架构是在哪一年提出的？', 
    options: [
      'A. 2015',
      'B. 2017',
      'C. 2019',
      'D. 2021'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q4', 
    question: '向量数据库的主要作用是什么？', 
    options: [
      'A. 存储关系型数据',
      'B. 存储和检索高维向量，支持相似性搜索',
      'C. 处理实时数据流',
      'D. 执行SQL查询'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'medium' 
  },
  { 
    id: 'q5', 
    question: '什么是Prompt Engineering？', 
    options: [
      'A. 硬件工程技术',
      'B. 设计和优化提示词的过程',
      'C. 软件开发方法',
      'D. 网络安全技术'
    ],
    expectedAnswer: 'B', 
    category: 'AI应用', 
    difficulty: 'easy' 
  },
  { 
    id: 'q6', 
    question: '梯度下降算法的目的是什么？', 
    options: [
      'A. 增加模型复杂度',
      'B. 最小化损失函数',
      'C. 加速数据传输',
      'D. 提高数据存储效率'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q7', 
    question: 'Fine-tuning是什么？', 
    options: [
      'A. 调整模型超参数',
      'B. 在预训练模型基础上进一步训练',
      'C. 优化硬件性能',
      'D. 数据清洗过程'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q8', 
    question: 'RAG与传统问答系统的主要区别是什么？', 
    options: [
      'A. 速度更快',
      'B. 通过检索外部知识库增强回答',
      'C. 占用更少内存',
      'D. 支持多语言'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'hard' 
  },
  { 
    id: 'q9', 
    question: '以下哪个不是大语言模型？', 
    options: [
      'A. GPT',
      'B. LLaMA',
      'C. ResNet',
      'D. Claude'
    ],
    expectedAnswer: 'C', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q10', 
    question: '什么是无监督学习？', 
    options: [
      'A. 使用标注数据训练',
      'B. 使用未标注数据发现模式',
      'C. 人工干预学习过程',
      'D. 离线学习'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'easy' 
  },
  { 
    id: 'q11', 
    question: '注意力机制的作用是什么？', 
    options: [
      'A. 加速计算',
      'B. 让模型聚焦于重要部分',
      'C. 减少内存使用',
      'D. 增加模型层数'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q12', 
    question: 'Embedding的作用是什么？', 
    options: [
      'A. 加密数据',
      'B. 将离散数据转换为连续向量',
      'C. 压缩文件',
      'D. 并行计算'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'medium' 
  },
  { 
    id: 'q13', 
    question: 'Few-shot Learning的特点是什么？', 
    options: [
      'A. 需要大量标注数据',
      'B. 通过少量样本学习新任务',
      'C. 只能处理图像数据',
      'D. 需要GPU加速'
    ],
    expectedAnswer: 'B', 
    category: 'AI应用', 
    difficulty: 'medium' 
  },
  { 
    id: 'q14', 
    question: '强化学习中智能体通过什么学习？', 
    options: [
      'A. 标注数据',
      'B. 与环境交互获得奖励',
      'C. 监督信号',
      'D. 专家指导'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q15', 
    question: 'BERT模型采用什么架构？', 
    options: [
      'A. 仅Encoder',
      'B. 仅Decoder',
      'C. Encoder-Decoder',
      'D. CNN'
    ],
    expectedAnswer: 'A', 
    category: '深度学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q16', 
    question: 'Tokenization的作用是什么？', 
    options: [
      'A. 加密文本',
      'B. 将文本分割成子词单元',
      'C. 翻译文本',
      'D. 生成图像'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q17', 
    question: '以下哪种方法不能防止过拟合？', 
    options: [
      'A. 正则化',
      'B. 数据增强',
      'C. 增加模型参数',
      'D. 早停'
    ],
    expectedAnswer: 'C', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q18', 
    question: '分布式表示的特点是什么？', 
    options: [
      'A. 每个特征独立编码',
      'B. 相似概念在向量空间距离更近',
      'C. 使用二进制编码',
      'D. 只能表示文本数据'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'medium' 
  },
  { 
    id: 'q19', 
    question: 'GAN由哪两部分组成？', 
    options: [
      'A. 编码器和解码器',
      'B. 生成器和判别器',
      'C. 训练器和测试器',
      'D. 客户端和服务器'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q20', 
    question: '迁移学习的目的是什么？', 
    options: [
      'A. 迁移数据存储位置',
      'B. 将一个任务的知识迁移到另一个任务',
      'C. 并行处理任务',
      'D. 压缩模型'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q21', 
    question: '知识图谱的主要组成部分是什么？', 
    options: [
      'A. 实体和关系',
      'B. 数字和符号',
      'C. 图像和文本',
      'D. 音频和视频'
    ],
    expectedAnswer: 'A', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q22', 
    question: 'Fine-tuning和Prompt Tuning的主要区别是什么？', 
    options: [
      'A. 训练速度',
      'B. Fine-tuning更新模型权重，Prompt Tuning只更新提示词参数',
      'C. 数据需求',
      'D. 硬件要求'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q23', 
    question: '精确率（Precision）的定义是什么？', 
    options: [
      'A. 真正样本被正确预测的比例',
      'B. 预测为正的样本中真正为正的比例',
      'C. 所有样本的正确率',
      'D. 负样本被正确预测的比例'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q24', 
    question: 'Transformer中Encoder的作用是什么？', 
    options: [
      'A. 生成输出序列',
      'B. 对输入序列进行编码提取特征',
      'C. 优化计算效率',
      'D. 存储中间结果'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q25', 
    question: '什么是自回归语言模型？', 
    options: [
      'A. 只能理解文本的模型',
      'B. 按顺序生成文本，每个位置只依赖前面的位置',
      'C. 并行处理所有位置',
      'D. 只能处理图像的模型'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'medium' 
  },
  { 
    id: 'q26', 
    question: '什么是Masked Language Modeling（MLM）？', 
    options: [
      'A. 一种数据加密技术',
      'B. BERT使用的预训练任务，预测被掩盖的token',
      'C. 图像掩码技术',
      'D. 网络安全技术'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q27', 
    question: '什么是LoRA（Low-Rank Adaptation）？', 
    options: [
      'A. 一种图像处理技术',
      'B. 高效微调技术，通过低秩矩阵更新模型',
      'C. 数据压缩算法',
      'D. 数据库技术'
    ],
    expectedAnswer: 'B', 
    category: 'AI应用', 
    difficulty: 'hard' 
  },
  { 
    id: 'q28', 
    question: '什么是上下文窗口（Context Window）？', 
    options: [
      'A. 模型能处理的最大文本长度',
      'B. 操作系统窗口',
      'C. 数据窗口',
      'D. 图形界面组件'
    ],
    expectedAnswer: 'A', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q29', 
    question: '什么是Chain of Thought（CoT）？', 
    options: [
      'A. 一种区块链技术',
      'B. 引导模型逐步推理的提示技巧',
      'C. 数据处理流程',
      'D. 神经网络结构'
    ],
    expectedAnswer: 'B', 
    category: 'AI应用', 
    difficulty: 'medium' 
  },
  { 
    id: 'q30', 
    question: '什么是思维链提示（Chain of Thought Prompting）？', 
    options: [
      'A. 让模型输出中间推理步骤',
      'B. 压缩模型参数',
      'C. 加速推理速度',
      'D. 减少内存使用'
    ],
    expectedAnswer: 'A', 
    category: 'AI应用', 
    difficulty: 'medium' 
  },
  { 
    id: 'q31', 
    question: '什么是工具调用（Tool Calling）？', 
    options: [
      'A. 模型调用外部工具获取信息',
      'B. 操作系统命令',
      'C. 硬件驱动',
      'D. 软件安装'
    ],
    expectedAnswer: 'A', 
    category: 'AI应用', 
    difficulty: 'medium' 
  },
  { 
    id: 'q32', 
    question: '什么是Agent？', 
    options: [
      'A. 一种数据格式',
      'B. 能够自主决策和执行任务的AI系统',
      'C. 硬件设备',
      'D. 编程语言'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q33', 
    question: '什么是向量检索的核心算法？', 
    options: [
      'A. BFS',
      'B. KNN（K近邻）',
      'C. DFS',
      'D. 二分查找'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'medium' 
  },
  { 
    id: 'q34', 
    question: '什么是语义搜索？', 
    options: [
      'A. 基于关键词匹配的搜索',
      'B. 基于语义理解的搜索，理解查询意图',
      'C. 图像搜索',
      'D. 语音搜索'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q35', 
    question: '什么是多模态学习？', 
    options: [
      'A. 只处理文本数据',
      'B. 同时处理多种类型数据（文本、图像、音频等）',
      'C. 单一数据类型处理',
      'D. 离线学习'
    ],
    expectedAnswer: 'B', 
    category: 'AI基础', 
    difficulty: 'easy' 
  },
  { 
    id: 'q36', 
    question: '什么是提示工程的Few-shot技术？', 
    options: [
      'A. 提供少量示例让模型学习',
      'B. 提供大量示例',
      'C. 不提供示例',
      'D. 自动生成示例'
    ],
    expectedAnswer: 'A', 
    category: 'AI应用', 
    difficulty: 'easy' 
  },
  { 
    id: 'q37', 
    question: '什么是参数高效微调（PEFT）？', 
    options: [
      'A. 训练所有模型参数',
      'B. 只训练部分参数来适应新任务',
      'C. 增加模型参数',
      'D. 减少模型层数'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q38', 
    question: '什么是注意力分数？', 
    options: [
      'A. 模型对输入各部分的关注程度',
      'B. 模型准确率',
      'C. 训练速度',
      'D. 内存使用量'
    ],
    expectedAnswer: 'A', 
    category: '深度学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q39', 
    question: '什么是因果语言模型？', 
    options: [
      'A. 预测未来事件的模型',
      'B. 基于因果推理的模型',
      'C. 从左到右生成文本的模型',
      'D. 分析因果关系的模型'
    ],
    expectedAnswer: 'C', 
    category: 'AI基础', 
    difficulty: 'medium' 
  },
  { 
    id: 'q40', 
    question: '什么是MoE（Mixture of Experts）？', 
    options: [
      'A. 混合专家模型，不同专家处理不同任务',
      'B. 数据混合技术',
      'C. 模型压缩技术',
      'D. 分布式计算'
    ],
    expectedAnswer: 'A', 
    category: '深度学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q41', 
    question: '什么是召回率（Recall）？', 
    options: [
      'A. 预测正确的比例',
      'B. 真正为正的样本中被预测为正的比例',
      'C. 所有样本数',
      'D. 负样本比例'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q42', 
    question: '什么是F1分数？', 
    options: [
      'A. 精确率和召回率的调和平均数',
      'B. 模型训练时间',
      'C. 模型参数数量',
      'D. 数据量'
    ],
    expectedAnswer: 'A', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q43', 
    question: '什么是Dropout？', 
    options: [
      'A. 数据丢失处理',
      'B. 正则化技术，随机丢弃神经元',
      'C. 模型保存格式',
      'D. 数据增强技术'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q44', 
    question: '什么是Batch Normalization？', 
    options: [
      'A. 批量处理数据',
      'B. 对每批数据进行归一化，加速训练',
      'C. 数据备份',
      'D. 模型评估'
    ],
    expectedAnswer: 'B', 
    category: '深度学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q45', 
    question: '什么是自监督学习？', 
    options: [
      'A. 不需要标注数据，从数据本身学习',
      'B. 人工监督训练',
      'C. 强化学习',
      'D. 监督学习'
    ],
    expectedAnswer: 'A', 
    category: '机器学习', 
    difficulty: 'medium' 
  },
  { 
    id: 'q46', 
    question: '什么是对比学习？', 
    options: [
      'A. 比较不同模型性能',
      'B. 通过比较相似和不相似样本学习表示',
      'C. 数据对比分析',
      'D. 模型对比测试'
    ],
    expectedAnswer: 'B', 
    category: '机器学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q47', 
    question: '什么是Siamese网络？', 
    options: [
      'A. 连体网络，用于相似度匹配',
      'B. 暹罗猫识别网络',
      'C. 并行网络',
      'D. 分布式网络'
    ],
    expectedAnswer: 'A', 
    category: '深度学习', 
    difficulty: 'hard' 
  },
  { 
    id: 'q48', 
    question: '什么是知识蒸馏？', 
    options: [
      'A. 从大模型向小模型传递知识',
      'B. 数据压缩',
      'C. 知识图谱构建',
      'D. 模型训练'
    ],
    expectedAnswer: 'A', 
    category: 'AI应用', 
    difficulty: 'hard' 
  },
];

export async function getTestQuestions(count?: number): Promise<TestQuestion[]> {
  if (count && count > 0) {
    const shuffled = [...sampleQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, sampleQuestions.length));
  }
  return sampleQuestions;
}

export async function evaluateAnswer(question: TestQuestion, userAnswer: string, aiAnswer: string): Promise<EvaluationResult> {
  const expected = question.expectedAnswer;
  const user = userAnswer.trim();
  
  let score = 0;
  let feedback = '';
  
  if (user === expected) {
    score = 100;
    feedback = '回答正确！';
  } else if (user.length > 0) {
    score = 0;
    feedback = `回答错误，正确答案是：${expected}`;
  } else {
    score = 0;
    feedback = '请尝试回答问题。';
  }

  return {
    id: uuidv4(),
    questionId: question.id,
    userAnswer,
    aiAnswer,
    score,
    feedback,
    timestamp: new Date(),
  };
}

export async function saveEvaluationSession(results: EvaluationResult[]): Promise<EvaluationSession> {
  const correctCount = results.filter(r => r.score >= 70).length;
  const totalScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);

  const session: EvaluationSession = {
    id: uuidv4(),
    results,
    totalScore,
    correctCount,
    timestamp: new Date(),
  };

  const filePath = path.join(TEST_DATA_DIR, `${session.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(session, null, 2));

  return session;
}

export async function getEvaluationHistory(): Promise<EvaluationSession[]> {
  try {
    const files = await fs.promises.readdir(TEST_DATA_DIR);
    const sessions: EvaluationSession[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(TEST_DATA_DIR, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const session = JSON.parse(content);
        sessions.push(session);
      }
    }

    return sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('读取评测历史失败:', error);
    return [];
  }
}