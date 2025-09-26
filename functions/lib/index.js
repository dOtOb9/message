"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOIDCUser = exports.handleOIDCPostAuth = exports.addTodoFromMessage = void 0;
const admin = require("firebase-admin");
const v2_1 = require("firebase-functions/v2");
const firestore_1 = require("firebase-functions/v2/firestore");
admin.initializeApp();
const db = admin.firestore();
// 環境変数からOpenAI APIキーを取得
// firebase functions:config:set openai.api_key="YOUR_OPENAI_API_KEY"
// または環境変数 OPENAI_API_KEY を設定
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
exports.addTodoFromMessage = (0, firestore_1.onDocumentCreated)('messages/{messageId}', async (event) => {
    var _a, _b, _c;
    const snap = event.data;
    if (!snap) {
        v2_1.logger.error('No data found in document');
        return null;
    }
    const newMessage = snap.data();
    const messageId = event.params.messageId;
    v2_1.logger.info(`Processing new message: ${messageId}`, newMessage);
    // 送信者と受信者が特定できること、メッセージ内容があることを確認
    if (!newMessage.senderId || !newMessage.receiverId || !newMessage.content) {
        v2_1.logger.warn(`Skipping message ${messageId}: Missing senderId, receiverId, or content.`);
        return null;
    }
    // ToDoの対象となるユーザー（会話の相手）
    const userId = newMessage.receiverId;
    // 1. 直近3件の会話履歴を取得
    let conversationContext = [];
    try {
        const messagesRef = db.collection('messages')
            .where('senderId', 'in', [newMessage.senderId, newMessage.receiverId])
            .where('receiverId', 'in', [newMessage.senderId, newMessage.receiverId])
            .orderBy('timestamp', 'desc')
            .limit(3);
        const snapshot = await messagesRef.get();
        snapshot.docs.forEach(doc => conversationContext.unshift(doc.data().content));
        v2_1.logger.info(`Conversation context for message ${messageId}:`, conversationContext);
    }
    catch (error) {
        v2_1.logger.error(`Error fetching conversation context for ${messageId}:`, error);
    }
    // 2. OpenAI APIを呼び出し、ToDoが必要か判断・生成させる
    let aiResponse = null;
    const aiPrompt = `
    以下の会話コンテキストを考慮し、最新のメッセージに対してユーザーが後で返信や確認などの行動を起こす必要があるか判断してください。
    もし行動が必要な場合、「○○さんに△△の件を確認する」という形式で50文字以内のToDoを提案してください。
    提案するToDoには、最新のメッセージに記載されている具体的な相手の名前と確認内容を含めてください。
    ToDoが不要な場合や、具体的なToDoを抽出できない場合は、何も返さないでください。
    返答はJSON形式でお願いします。例: {"todoContent": "鈴木さんにプロジェクトの件を確認する", "isRelevant": true}
    または、ToDoが不要な場合は {"isRelevant": false}

    会話コンテキスト:
    ${conversationContext.map(c => `- ${c}`).join('\n')}

    最新のメッセージ: ${newMessage.content}
  `;
    try {
        // ローカル開発/テスト用のモック応答
        if (process.env.FUNCTIONS_EMULATOR === 'true' && !OPENAI_API_KEY) {
            v2_1.logger.info("Using AI mock response for local emulator.");
            if (newMessage.content.includes('確認')) {
                aiResponse = {
                    todoContent: `田中さんに〇〇の件を確認する (${newMessage.content.substring(0, 10)}...)`,
                    isRelevant: true
                };
            }
            else {
                aiResponse = { isRelevant: false };
            }
        }
        else if (!OPENAI_API_KEY) {
            v2_1.logger.error("OpenAI API key is not configured.");
            return null;
        }
        else {
            // OpenAI API呼び出し
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: aiPrompt
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });
            if (!openaiResponse.ok) {
                const errorBody = await openaiResponse.text();
                throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorBody}`);
            }
            const openaiJson = await openaiResponse.json();
            try {
                const rawText = (_c = (_b = (_a = openaiJson.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                aiResponse = rawText ? JSON.parse(rawText) : null;
            }
            catch (parseError) {
                v2_1.logger.error(`Failed to parse OpenAI response JSON for ${messageId}:`, parseError);
                return null;
            }
        }
    }
    catch (error) {
        v2_1.logger.error(`OpenAI API interaction failed for ${messageId}:`, error);
        return null;
    }
    // ToDoが不要、または抽出できなかった場合
    if (!aiResponse || !aiResponse.isRelevant || !aiResponse.todoContent) {
        v2_1.logger.info(`AI determined no ToDo needed or content not extracted for ${messageId}.`);
        return null;
    }
    let extractedTodoContent = aiResponse.todoContent.trim();
    // 3. ToDoの内容を50文字以内に制限
    if (extractedTodoContent.length > 50) {
        extractedTodoContent = extractedTodoContent.substring(0, 50) + '...';
        v2_1.logger.warn(`Truncated ToDo content to 50 characters for message ${messageId}.`);
    }
    // 4. 重複排除 (同じユーザー、同日、ToDo内容の完全一致)
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingTodosSnapshot = await db.collection('users').doc(userId).collection('todos')
            .where('createdAt', '>=', today)
            .where('content', '==', extractedTodoContent)
            .limit(1)
            .get();
        if (!existingTodosSnapshot.empty) {
            v2_1.logger.info(`Skipping ToDo for ${messageId}: Duplicate found for user ${userId} with content "${extractedTodoContent}".`);
            return null;
        }
    }
    catch (error) {
        v2_1.logger.error(`Error during duplicate check for ${messageId}:`, error);
    }
    // 5. ToDoをFirestoreに追加
    try {
        await db.collection('users').doc(userId).collection('todos').add({
            content: extractedTodoContent,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            sourceMessageId: messageId,
        });
        v2_1.logger.info(`ToDo "${extractedTodoContent}" added for user ${userId} from message ${messageId}.`);
    }
    catch (error) {
        v2_1.logger.error(`Failed to add ToDo for ${messageId} and user ${userId}:`, error);
        return null;
    }
    return null;
});
// Firebase標準OIDC認証用の関数
var firebase_oidc_1 = require("./firebase-oidc");
Object.defineProperty(exports, "handleOIDCPostAuth", { enumerable: true, get: function () { return firebase_oidc_1.handleOIDCPostAuth; } });
Object.defineProperty(exports, "initializeOIDCUser", { enumerable: true, get: function () { return firebase_oidc_1.initializeOIDCUser; } });
//# sourceMappingURL=index.js.map