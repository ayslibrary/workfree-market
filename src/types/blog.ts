export interface BlogHistory {
  id: string;
  userId: string;
  keyword: string;
  content: string;
  tone: 'friendly' | 'professional' | 'casual' | 'academic';
  targetAudience: 'general' | 'professional' | 'student' | 'expert';
  length: 'short' | 'medium' | 'long';
  blogStyle?: 'basic' | 'seo' | 'marketing';
  additionalContent?: string;
  tokensUsed: number;
  createdAt: string;
}

