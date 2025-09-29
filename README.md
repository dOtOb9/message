# StickerSmash - AI-Powered Chat & Todo App

![React Native](https://img.shields.io/badge/React%20Native-0.76.5-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange.svg)
![Expo](https://img.shields.io/badge/Expo-54.0.10-black.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-API-green.svg)

## 🚀 Overview

Messageは、React Native + TypeScriptで構築された、AI駆動の革新的なチャット&ToDo管理アプリケーションです。**OpenAI GPTを活用した自動ToDo生成機能**が最大の特徴で、チャットでの会話から自動的にタスクを抽出し、整理します。

### ✨ Key Features

- 🤖 **AI自動ToDo生成**: チャットの内容をOpenAI GPTで分析し、自動的にToDo項目を生成
- 💬 **リアルタイムチャット**: Firebase Firestoreによる即座な同期
- ✅ **統合ToDo管理**: 手動作成 + AI生成の統合管理システム
- 🔐 **安全な認証**: Firebase Authenticationによる多様な認証方式
- 📱 **クロスプラットフォーム**: Web、iOS、Android対応
- ⚡ **リアルタイム同期**: 全てのデータが即座にデバイス間で同期

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native with Expo Router
- **Language**: TypeScript (完全型安全)
- **Backend**: Firebase (Authentication, Firestore, Functions)
- **AI Integration**: OpenAI GPT-3.5-turbo & GPT-4
- **State Management**: Custom Hooks Pattern
- **Styling**: NativeWind (Tailwind CSS for React Native)

### Project Structure
```
app/
├── (auth)/          # 認証関連画面
├── (tabs)/          # メインアプリケーション
components/          # 再利用可能UIコンポーネント
├── TodoStates/      # ToDo状態管理コンポーネント
hooks/              # カスタムフック
├── useChat.ts       # チャット + AI統合
├── useTodos.ts      # ToDo管理
├── useFriends.ts    # 友達管理
services/           # 外部サービス統合
├── openaiService.ts # OpenAI API統合
├── firestoreService.ts # Firestore操作
types/              # TypeScript型定義
utils/              # ユーティリティ関数
contexts/           # React Context
```

## 🤖 AI Integration Details

### Smart Todo Generation Process
1. **軽量分析**: GPT-3.5-turboでToDo生成の必要性を判定
2. **詳細分析**: 必要な場合のみGPT-4で高品質な分析を実行
3. **最適化**: タイムスタンプベースで既読メッセージのスキップ
4. **自動保存**: 生成されたToDoを自動的にFirestoreに保存

### OpenAI API Usage
- **Model Selection**: GPT-3.5-turbo (軽量分析) + GPT-4 (詳細分析)
- **Cost Optimization**: 段階的分析による無駄な API コール削減
- **Error Handling**: 請求エラーやレート制限の適切な処理
- **Environment Variables**: `.env.local` での安全なAPI Key管理

### Example AI Analysis Flow
```typescript
// チャット内容の例
"明日の会議で使う資料を準備して、プレゼンの練習もしないと"

// ↓ AI分析結果
Generated Todos:
1. "明日の会議資料を準備する" (priority: high)
2. "プレゼンテーションの練習をする" (priority: medium)
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Quick Start (Ready to Run!)

このプロジェクトは**すぐに起動できるように設定済み**です。Firebase設定も含まれているため、以下の手順だけで動作確認できます。

1. **Clone the repository**
```bash
git clone https://github.com/dOtOb9/message.git
cd StickerSmash
```

2. **Install dependencies**
```bash
npm install
```

3. **OpenAI API Key Setup (Optional - AI機能を試す場合)**
   
   AI自動ToDo生成機能を試したい場合のみ設定してください：
   
   a) Get API key from [OpenAI Platform](https://platform.openai.com/)
   
   b) Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   
   c) Edit `.env.local` and add your API key:
   ```bash
   EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

4. **Start the application**
```bash
# Web版を起動
npm run web

# または全プラットフォーム用開発サーバー
npm start
```

5. **Access the app**
   - Web: http://localhost:8081
   - Mobile: Expo Go アプリでQRコードをスキャン

### 🎯 すぐに試せる機能

**OpenAI API Key なしでも動作する機能:**
- ✅ ユーザー登録・ログイン
- ✅ リアルタイムチャット
- ✅ 手動ToDo作成・管理
- ✅ 友達追加・管理
- ✅ すべてのUI操作

**OpenAI API Key 設定後に利用可能:**
- 🤖 AI自動ToDo生成（チャット内容から自動抽出）

## 🔥 Firebase Configuration (Already Configured!)

このプロジェクトには**作業用のFirebase設定**が含まれているため、追加設定は不要です。

### 設定済み内容:
- ✅ **Authentication**: Email/Password, Google OAuth
- ✅ **Firestore Database**: リアルタイムデータ同期
- ✅ **Cloud Functions**: サーバーサイド処理

### 独自のFirebase環境を使用したい場合:

1. **Create Firebase Project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Services:**
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Cloud Functions (optional)

3. **Update Configuration:**
   
   `firebase-config.ts` を更新:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     // ... other config
   };
   ```

## 🚀 Testing the Application

### 1. **User Registration & Login**
```bash
# アプリ起動後
1. "Register" からアカウント作成
2. Email/Password でログイン
3. または Google OAuth でログイン
```

### 2. **Chat Functionality**
```bash
# ログイン後
1. "Chat" タブでチャット開始
2. メッセージ送信でリアルタイム同期確認
3. 複数ブラウザでテスト可能
```

### 3. **Todo Management**
```bash
# 手動ToDo
1. "Todo" タブでタスク作成
2. 完了状態の切り替え
3. 削除機能

# AI自動生成 (API Key設定後)
1. Chatで会話（例: "明日の会議資料を準備する"）
2. 自動的にToDoが生成される
3. "Todo" タブで確認
```

## 🔧 Development Environment

### File Structure for Development
```
📁 Project Root
├── .env.local          # あなたのAPI Key (gitignore済み)
├── .env.example        # 設定例ファイル
├── firebase-config.ts  # Firebase設定 (設定済み)
├── app/               # アプリケーション画面
├── components/        # UIコンポーネント
├── hooks/            # カスタムフック
├── services/         # API統合
└── types/            # TypeScript定義
```

## 📱 Features Walkthrough

### 1. Authentication
- Email/Password login
- Google OAuth integration
- User profile management

### 2. Chat System
- Real-time messaging with Firestore
- Message history and synchronization
- Friend invitation system

### 3. AI-Powered Todo Generation
```typescript
// Example: Chat analysis flow
useEffect(() => {
  // メッセージが3件以上追加されたら分析開始
  if (newMessages.length >= 3) {
    analyzeAndGenerateTodos(messages);
  }
}, [messages]);
```

### 4. Todo Management
- Manual todo creation
- AI-generated todo integration
- Status management (pending, completed)
- Cross-platform synchronization

## 🏛️ Code Quality & Best Practices

### Architecture Patterns
- **Custom Hooks Pattern**: ロジックの再利用性とテスタビリティ
- **Service Layer**: 外部API統合の抽象化
- **Component Composition**: UIコンポーネントの単一責任原則
- **Type Safety**: 完全なTypeScript型安全性

### Performance Optimizations
- Firestore onSnapshot for real-time updates
- OpenAI API call optimization with staged analysis
- Efficient component re-rendering with proper dependency arrays
- Memory leak prevention with proper cleanup

### Code Example: Custom Hook Integration
```typescript
export const useChat = (chatId: string, user: User, friendName: string) => {
  // リアルタイムメッセージ管理
  // AI分析統合
  // エラーハンドリング
  // パフォーマンス最適化
  return { messages, sendMessage, loading, error };
};
```

## 🧪 Technical Highlights

### 1. Advanced TypeScript Usage
- Comprehensive type definitions across all layers
- Generic types for reusable components
- Strict null checks and proper error handling

### 2. Firebase Integration
- Real-time subscriptions with onSnapshot
- Efficient batch operations for data management
- Security rules and data validation

### 3. AI/ML Integration
- Strategic API usage to minimize costs
- Intelligent message analysis and todo extraction
- Error handling for AI service limitations

### 4. Cross-Platform Development
- Expo Router for navigation
- NativeWind for consistent styling
- Web and mobile compatibility

## 🔒 Security & Privacy

- Firebase Security Rules implementation
- User data isolation and privacy protection  
- **Secure API key management** via `.env.local` (excluded from version control)
- Input validation and sanitization
- Environment variable best practices for sensitive data

## 📊 Environment Variables

### Required for AI Features
```bash
# .env.local (create this file)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

### Optional Configuration
- Firebase configuration is already included and working
- No additional environment setup required for basic functionality

## 📈 Scalability Considerations

- Modular architecture for easy feature addition
- Service abstraction for backend flexibility
- Efficient database queries and indexing
- Component reusability across the application

## 🚀 Future Enhancements

- [ ] Push notifications for new messages/todos
- [ ] Advanced AI features (task priority, deadline suggestion)
- [ ] Team collaboration features
- [ ] Voice message integration
- [ ] Calendar synchronization

## 👨‍💻 Development Notes

This project demonstrates:
- **Full-stack development** with modern React Native ecosystem
- **AI integration** in mobile applications
- **Real-time data management** with Firebase
- **TypeScript mastery** in large-scale applications
- **Performance optimization** techniques
- **Clean architecture** principles

## 📞 Contact

**Developer**: dOtOb9  
**Repository**: [GitHub - dOtOb9/message](https://github.com/dOtOb9/message)

## 🔍 For Reviewers

### Quick Demo Steps
1. Clone & `npm install` & `npm run web`
2. Register new account or login  
3. Test chat functionality
4. Create manual todos
5. (Optional) Set `.env.local` with OpenAI key to test AI features

### Key Files to Review
- `hooks/useChat.ts` - AI integration & chat management
- `hooks/useTodos.ts` - Real-time todo management  
- `services/openaiService.ts` - OpenAI API integration
- `types/` - TypeScript definitions
- Architecture: Clean separation of concerns

### Technical Highlights
- **Zero-config startup**: Works immediately after `npm install`
- **Production-ready**: Error handling, loading states, type safety
- **Scalable architecture**: Service layer, custom hooks, component composition
- **AI integration**: Cost-optimized OpenAI usage with fallbacks

---

*Built with ❤️ using React Native, TypeScript, Firebase, and OpenAI*
