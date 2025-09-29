/**
 * デバッグ用のサービス - OpenAI設定とAPI接続をテスト
 */

// 環境変数をテスト
export const testEnvironmentVariables = () => {
  console.log('=== 環境変数チェック ===');
  console.log('EXPO_PUBLIC_OPENAI_API_KEY:', process.env.EXPO_PUBLIC_OPENAI_API_KEY ? 
    `設定済み (${process.env.EXPO_PUBLIC_OPENAI_API_KEY.substring(0, 10)}...)` : 
    '未設定');
  
  return !!process.env.EXPO_PUBLIC_OPENAI_API_KEY;
};

// 簡単なOpenAI APIテスト（fetch APIベース）
export const testOpenAIConnection = async () => {
  console.log('=== OpenAI API接続テスト ===');
  
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not set');
    }
    
    console.log('fetchベースのOpenAI APIテスト開始...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test. Please respond with just "OK".'
          }
        ],
        max_tokens: 10,
        temperature: 0
      }),
    });
    
    console.log('API レスポンス状態:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      throw new Error(`API error: ${response.status} ${errorText}`);
    }
    
    const completion = await response.json();
    console.log('API呼び出し成功:', completion);
    
    const responseText = completion.choices[0]?.message?.content;
    console.log('レスポンステキスト:', responseText);
    
    return { success: true, response: responseText };
  } catch (error: any) {
    console.error('API呼び出しエラー:', error);
    return { success: false, error: error.message };
  }
};

// 全体的なデバッグテスト
export const runFullDebugTest = async () => {
  console.log('=== OpenAI デバッグテスト開始 ===');
  
  // 1. 環境変数チェック
  const hasApiKey = testEnvironmentVariables();
  if (!hasApiKey) {
    console.log('❌ API keyが設定されていません');
    return false;
  }
  
  // 2. API接続テスト
  const apiTest = await testOpenAIConnection();
  if (!apiTest.success) {
    console.log('❌ API接続に失敗しました:', apiTest.error);
    return false;
  }
  
  console.log('✅ すべてのテストが成功しました');
  return true;
};