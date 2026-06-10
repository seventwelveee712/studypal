import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white dark:bg-[#252A33] rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-[#FFE5E5] dark:bg-[#4A3535] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-[#E87D4E]" />
            </div>
            <h2 className="text-xl font-bold text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">
              出现错误
            </h2>
            <p className="text-[#8A9BB2] mb-6">
              {this.state.error?.message || '发生了一个未知错误'}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#A5C9FF] hover:bg-[#8BB8E8] text-[#1E3A5F] rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#252A33] rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#FFE5E5] dark:bg-[#4A3535] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-[#E87D4E]" />
        </div>
        <h2 className="text-xl font-bold text-[#3D4A5C] dark:text-[#E8EEF4] mb-2">
          出现错误
        </h2>
        <p className="text-[#8A9BB2] mb-6">
          {error.message || '发生了一个未知错误'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#A5C9FF] hover:bg-[#8BB8E8] text-[#1E3A5F] rounded-xl font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          重试
        </button>
      </div>
    </div>
  );
}
