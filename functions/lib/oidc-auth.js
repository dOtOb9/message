"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oidcAuth = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const axios_1 = require("axios");
const jose = require("jose");
// Firebase Admin SDKの初期化
if (!admin.apps.length) {
    admin.initializeApp();
}
/**
 * OIDC認証の処理
 * クライアントからの認証コードを受け取り、アクセストークンとIDトークンを取得し、
 * Firebaseカスタムトークンを生成して返す
 */
exports.oidcAuth = (0, https_1.onRequest)({
    cors: true,
    region: "asia-northeast1"
}, async (request, response) => {
    try {
        // OIDCプロバイダーの設定（環境変数から取得）
        const OIDC_ISSUER = process.env.OIDC_ISSUER; // 例: https://login.microsoftonline.com/tenant-id/v2.0
        const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID;
        const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET;
        if (!OIDC_ISSUER || !OIDC_CLIENT_ID || !OIDC_CLIENT_SECRET) {
            throw new Error("OIDC設定が不完全です");
        }
        const { code, redirect_uri, code_verifier } = request.body;
        if (!code || !redirect_uri) {
            response.status(400).json({ error: "認証コードまたはリダイレクトURIが不足しています" });
            return;
        }
        // 1. 認証コードをアクセストークンとIDトークンに交換
        const tokenResponse = await axios_1.default.post(`${OIDC_ISSUER}/token`, {
            grant_type: 'authorization_code',
            client_id: OIDC_CLIENT_ID,
            client_secret: OIDC_CLIENT_SECRET,
            code,
            redirect_uri,
            code_verifier, // PKCE用
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const tokens = tokenResponse.data;
        // 2. IDトークンを検証
        const jwks = jose.createRemoteJWKSet(new URL(`${OIDC_ISSUER}/.well-known/jwks.json`));
        const { payload } = await jose.jwtVerify(tokens.id_token, jwks, {
            issuer: OIDC_ISSUER,
            audience: OIDC_CLIENT_ID,
        });
        const userInfo = payload;
        // 3. Firebaseでユーザーを作成または取得
        let firebaseUser;
        try {
            firebaseUser = await admin.auth().getUserByEmail(userInfo.email);
        }
        catch (error) {
            // ユーザーが存在しない場合は作成
            firebaseUser = await admin.auth().createUser({
                uid: `oidc-${userInfo.sub}`,
                email: userInfo.email,
                emailVerified: userInfo.email_verified,
                displayName: userInfo.name,
                photoURL: userInfo.picture,
            });
        }
        // 4. Firebaseカスタムトークンを生成
        const customToken = await admin.auth().createCustomToken(firebaseUser.uid, {
            provider: 'oidc',
            oidc_subject: userInfo.sub,
        });
        // 5. Firestoreにユーザープロファイルを保存/更新
        const userProfileRef = admin.firestore().collection('users').doc(firebaseUser.uid);
        await userProfileRef.set({
            email: userInfo.email,
            displayName: userInfo.name || null,
            photoURL: userInfo.picture || null,
            provider: 'oidc',
            oidc_subject: userInfo.sub,
            lastSignIn: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        // 6. レスポンスを返す
        response.json({
            success: true,
            customToken,
            user: {
                uid: firebaseUser.uid,
                email: userInfo.email,
                displayName: userInfo.name,
                photoURL: userInfo.picture,
            },
        });
    }
    catch (error) {
        console.error('OIDC認証エラー:', error);
        response.status(500).json({
            error: 'OIDC認証に失敗しました',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
//# sourceMappingURL=oidc-auth.js.map