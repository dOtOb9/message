import type { GeneratedTodo, Message } from '@/types';

// APIキーの取得
const getApiKey = () => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  console.log('OpenAI API Key:', apiKey ? 'API key found' : 'API key not found');
  return apiKey;
};

/**
 * OpenAI APIを直接fetchで呼び出す（Web環境での互換性向上）
 */
const callOpenAIAPI = async (messages: any[], model = 'gpt-3.5-turbo', maxTokens = 200) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  console.log('OpenAI API呼び出し開始:', { model, maxTokens });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  console.log('OpenAI APIレスポンス状態:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', errorText);
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log('OpenAI APIレスポンス:', data);
  return data;
};

/**
 * 軽量な分析でToDo生成が必要かを判定
 */
export const checkIfTodoGenerationNeeded = async (
  recentMessages: Message[],
  userNames: { [key: string]: string }
): Promise<boolean> => {
  console.log('ToDo生成判定を開始します...', { messageCount: recentMessages.length });
  
  if (recentMessages.length === 0) {
    console.log('メッセージが空のため判定をスキップします');
    return false;
  }
  
  try {
    // 最新の5件のメッセージのみを分析対象とする
    const messagesToAnalyze = recentMessages.slice(-5);
    const chatText = messagesToAnalyze.map(msg => {
      const senderName = userNames[msg.senderId] || '不明';
      return `${senderName}: ${msg.text}`;
    }).join('\n');
    
    console.log('分析対象のチャットテキスト:', chatText);
    console.log('OpenAI APIを呼び出し中...');
    
    const completion = await callOpenAIAPI([
      {
        role: 'system',
        content: `あなたは会話の内容からタスクやToDo項目の存在を判定する専門家です。
以下の会話内容を分析して、実行可能なタスクやアクション項目が含まれているかを判定してください。

判定基準：
1. 具体的な作業や依頼が含まれている
2. 期限や予定が設定されている
3. 何かを準備・調査・購入する必要がある
4. フォローアップや連絡が必要
5. 決定事項の実行が必要

JSON形式で以下のように回答してください：
{
  "needsTodo": true/false,
  "reason": "判定理由",
  "confidence": 0-100の数値
}`
      },
      {
        role: 'user',
        content: `以下の会話にToDo生成が必要な内容が含まれているか判定してください：\n\n${chatText}`
      }
    ], 'gpt-3.5-turbo', 200);
    
    console.log('OpenAI API呼び出し完了:', completion);
    
    const response = completion.choices[0]?.message?.content;
    console.log('GPTレスポンス:', response);
    
    if (!response) {
      console.log('GPTレスポンスが空です');
      return false;
    }
    
    const analysis = JSON.parse(response);
    console.log('ToDo生成判定:', analysis);
    
    // 信頼度が70%以上でToDo生成が必要と判定された場合
    return analysis.needsTodo && analysis.confidence >= 70;
    
  } catch (error: any) {
    console.error('ToDo生成判定エラー:', error);
    return false;
  }
};

/**
 * チャット履歴を分析してToDoを生成
 */
export const generateTodosFromChat = async (
  messages: Message[],
  userNames: { [key: string]: string }
): Promise<GeneratedTodo[]> => {
  console.log('チャット分析を開始します...', { messageCount: messages.length });
  
  if (messages.length === 0) {
    console.log('メッセージが空のため分析をスキップします');
    return [];
  }
  
  try {
    // メッセージをテキスト形式に変換
    const chatHistory = messages.map(msg => {
      const senderName = userNames[msg.senderId] || '不明';
      const timestamp = msg.timestamp instanceof Date 
        ? msg.timestamp.toLocaleString('ja-JP')
        : msg.timestamp?.toDate()?.toLocaleString('ja-JP') || '不明';
      return `[${timestamp}] ${senderName}: ${msg.text}`;
    }).join('\n');
    
    console.log('分析対象のチャット履歴:', chatHistory.substring(0, 500) + '...');
    console.log('GPT-4でチャット分析を開始...');
    
    // GPT-4でチャットを分析しToDoを生成
    const completion = await callOpenAIAPI([
      {
        role: 'system',
        content: `あなたはチャット履歴を分析して、実行可能なToDoリストを生成するAIアシスタントです。
チャットから以下のような項目を抽出してToDoとして提案してください：
1. 作業やタスクの依頼
2. 会議や打ち合わせの予定
3. 研究や調査の必要性
4. 決定事項やフォローアップ
5. 購入や手配が必要なもの

JSON形式で以下のように出力してください：
{
  "todos": [
    {
      "title": "ToDoタイトル",
      "description": "詳細説明",
      "priority": "high|medium|low",
      "category": "カテゴリ名",
      "dueDate": "YYYY-MM-DDまたはnull",
      "relatedMessages": []
    }
  ]
}`
      },
      {
        role: 'user',
        content: `以下のチャット履歴を分析して、ToDoリストを生成してください：\n\n${chatHistory}`
      }
    ], 'gpt-4', 1500);
    
    console.log('GPT-4 API呼び出し完了:', completion);
    
    const response = completion.choices[0]?.message?.content;
    console.log('GPT-4レスポンス:', response);
    
    if (!response) {
      console.error('GPT-4からのレスポンスが空です');
      throw new Error('GPTからのレスポンスが空です');
    }
    
    // JSONレスポンスをパース
    const todoData = JSON.parse(response);
    console.log('生成されたToDo:', todoData);
    
    return todoData.todos || [];
    
  } catch (error: any) {
    console.error('チャット分析エラー:', error);
    return [];
  }
};