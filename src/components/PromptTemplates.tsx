'use client';

import { useState } from 'react';
import { Search, Copy, Check, Star, Sparkles, ChevronDown } from 'lucide-react';
import { PromptTemplate, promptCategories, samplePromptTemplates, renderPrompt } from '@/lib/promptTemplates';

export default function PromptTemplatesPanel() {
  const [templates] = useState<PromptTemplate[]>(samplePromptTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<string | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    const defaultValues: Record<string, string> = {};
    template.variables.forEach(v => {
      defaultValues[v.name] = v.defaultValue || '';
    });
    setVariableValues(defaultValues);
  };

  const handleCopyPrompt = () => {
    if (!selectedTemplate) return;
    const rendered = renderPrompt(selectedTemplate, variableValues);
    navigator.clipboard.writeText(rendered);
    setCopiedId(selectedTemplate.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderedPrompt = selectedTemplate ? renderPrompt(selectedTemplate, variableValues) : '';

  return (
    <div className="bg-white dark:bg-[#252A33] rounded-2xl border border-[#E8EEF4] dark:border-[#303841] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8EEF4] dark:border-[#303841]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">⚙️ Prompt模板管理</h3>
          <div className="flex items-center gap-2 text-sm text-[#8A9BB2]">
            <Sparkles className="w-4 h-4" />
            <span>智能提示词工程</span>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-80 border-r border-[#E8EEF4] dark:border-[#303841] flex flex-col">
          <div className="p-4 border-b border-[#E8EEF4] dark:border-[#303841]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9BB2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg border-none text-[#3D4A5C] dark:text-[#E8EEF4] text-sm focus:ring-2 focus:ring-[#A5C9FF]"
                placeholder="搜索模板..."
              />
            </div>
          </div>

          <div className="p-4 border-b border-[#E8EEF4] dark:border-[#303841]">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#A5C9FF] text-[#3D4A5C]'
                    : 'bg-[#F5F7FA] dark:bg-[#2A3039] text-[#8A9BB2] hover:bg-[#EDF1F7] dark:hover:bg-[#303841]'
                }`}
              >
                全部
              </button>
              {Object.entries(promptCategories).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === key
                      ? 'bg-[#A5C9FF] text-[#3D4A5C]'
                      : 'bg-[#F5F7FA] dark:bg-[#2A3039] text-[#8A9BB2] hover:bg-[#EDF1F7] dark:hover:bg-[#303841]'
                  }`}
                >
                  {value.icon} {value.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredTemplates.map(template => {
              const categoryInfo = promptCategories[template.category];
              return (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-[#A5C9FF]/20 border border-[#A5C9FF]'
                      : 'bg-[#F5F7FA] dark:bg-[#2A3039] hover:bg-[#EDF1F7] dark:hover:bg-[#303841]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryInfo.icon}</span>
                      <div>
                        <h5 className="font-medium text-[#3D4A5C] dark:text-[#E8EEF4] text-sm">
                          {template.name}
                        </h5>
                        <p className="text-xs text-[#8A9BB2]">{template.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(isExpanded === template.id ? null : template.id);
                      }}
                      className="text-[#8A9BB2] hover:text-[#3D4A5C] dark:hover:text-[#E8EEF4]"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded === template.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {isExpanded === template.id && (
                    <div className="mt-3 pt-3 border-t border-[#E8EEF4] dark:border-[#303841]">
                      <div className="flex items-center gap-2 text-xs text-[#8A9BB2]">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{template.performance.avgRating}分</span>
                        <span className="mx-2">·</span>
                        <span>使用 {template.performance.usageCount} 次</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-[#8A9BB2]">示例用法：</p>
                        <div className="mt-1 space-y-1">
                          {template.examples.slice(0, 2).map((ex, i) => (
                            <p key={i} className="text-xs text-[#3D4A5C] dark:text-[#E8EEF4]">- {ex}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-6">
          {!selectedTemplate ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Sparkles className="w-12 h-12 text-[#E1E7F0] dark:text-[#303841]" />
              <p className="text-[#8A9BB2] mt-4">请选择一个Prompt模板</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{promptCategories[selectedTemplate.category].icon}</span>
                    <div>
                      <h4 className="font-semibold text-[#3D4A5C] dark:text-[#E8EEF4]">
                        {selectedTemplate.name}
                      </h4>
                      <span className="text-sm text-[#8A9BB2]">{selectedTemplate.description}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F7FA] dark:bg-[#2A3039] rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">
                      {selectedTemplate.performance.avgRating}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-2 px-4 py-2 bg-[#7ED6B0] text-white rounded-lg font-medium hover:bg-[#2E7D58] transition-colors"
                  >
                    {copiedId === selectedTemplate.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制提示词
                      </>
                    )}
                  </button>
                </div>
              </div>

              {selectedTemplate.variables.length > 0 && (
                <div className="bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl p-4">
                  <h5 className="text-sm font-medium text-[#8A9BB2] mb-3">变量配置</h5>
                  <div className="space-y-3">
                    {selectedTemplate.variables.map(variable => (
                      <div key={variable.name}>
                        <label className="block text-sm text-[#3D4A5C] dark:text-[#E8EEF4] mb-1">
                          {variable.name}
                          <span className="text-[#8A9BB2] ml-2">({variable.description})</span>
                        </label>
                        <input
                          type="text"
                          value={variableValues[variable.name] || ''}
                          onChange={(e) => setVariableValues(prev => ({
                            ...prev,
                            [variable.name]: e.target.value
                          }))}
                          placeholder={variable.defaultValue || `输入${variable.name}...`}
                          className="w-full px-4 py-2 bg-white dark:bg-[#252A33] rounded-lg border-none text-[#3D4A5C] dark:text-[#E8EEF4] text-sm focus:ring-2 focus:ring-[#A5C9FF]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#F5F7FA] dark:bg-[#2A3039] rounded-xl p-4">
                <h5 className="text-sm font-medium text-[#8A9BB2] mb-3">生成的提示词</h5>
                <pre className="whitespace-pre-wrap text-sm text-[#3D4A5C] dark:text-[#E8EEF4] bg-white dark:bg-[#252A33] p-4 rounded-lg overflow-x-auto">
                  {renderedPrompt}
                </pre>
              </div>

              <div className="bg-[#E8F5ED] dark:bg-[#243D2E] rounded-xl p-4">
                <h5 className="text-sm font-medium text-[#2E7D58] mb-2">💡 使用提示</h5>
                <ul className="space-y-1 text-sm text-[#3D4A5C] dark:text-[#E8EEF4]">
                  <li>• 将生成的提示词复制到AI对话中使用</li>
                  <li>• 根据学习内容调整变量值获得更好效果</li>
                  <li>• 可以将常用模板收藏以便快速使用</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}