import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// 初期化
admin.initializeApp();
// 管理者権限でfirestoreを操作する
// 毎回呼び出すと実行速度が遅くなるため、定数に入れてメモリを確保する
const db = admin.firestore();

const sendResponse = (response: functions.Response, statusCode: number, body: any) => {
  response.send({
    statusCode,
    body: JSON.stringify(body)
  })
}

// 必ずexportして外部からAPIを叩けるようにする
export const addDataset = functions.https.onRequest(async (req: any, res: any) => {
  if (req.method !== 'POST') {
    sendResponse(res, 405, {error: 'Invalid Request!'})
  } else {
    const dataset = req.body
    // オブジェクトのキーを取り出す
    for (const key of Object.keys(dataset)) {
      const data = dataset[key]
      await db.collection('questions').doc(key).set(data)
    }
    sendResponse(res, 200, {message: 'Successfully added dataset!'})
  }
})
