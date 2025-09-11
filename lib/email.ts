import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailTemplateData {
  name: string
  email: string
  gender: 'male' | 'female'
}

export async function sendConfirmationEmail(data: EmailTemplateData) {
  const genderText = data.gender === 'male' ? '男性' : '女性'
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LANDBRIDGE CUP 2025 エントリー完了</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- ヘッダー -->
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; color: white; font-size: 28px; text-align: center;">LANDBRIDGE CUP 2025</h1>
          <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); text-align: center; font-size: 16px;">エントリー完了のお知らせ</p>
        </div>
        
        <!-- メインコンテンツ -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; margin-bottom: 10px;">${data.name} 様</p>
          
          <p style="color: #374151; line-height: 1.8; margin-bottom: 30px;">
            この度は、LANDBRIDGE CUP 2025にエントリーいただき、誠にありがとうございます。<br>
            お支払いが確認され、エントリーが完了いたしました。
          </p>
          
          <!-- エントリー情報 -->
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #059669; margin: 0 0 15px; font-size: 16px;">エントリー情報</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">お名前:</td>
                <td style="padding: 8px 0; font-weight: bold;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">性別:</td>
                <td style="padding: 8px 0; font-weight: bold;">${genderText}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">参加費:</td>
                <td style="padding: 8px 0; font-weight: bold;">¥3,000（支払い済み）</td>
              </tr>
            </table>
          </div>
          
          <!-- 大会情報 -->
          <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #059669; margin: 0 0 15px; font-size: 18px;">🏐 大会詳細</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #374151;"><strong>日時:</strong></td>
                <td style="padding: 8px 0;">2025年10月26日（日）13:00-17:00</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #374151;"><strong>集合時間:</strong></td>
                <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">12:45（時間厳守）</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #374151;"><strong>会場:</strong></td>
                <td style="padding: 8px 0;">越谷地域スポーツセンター</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #374151;"><strong>住所:</strong></td>
                <td style="padding: 8px 0;">〒343-0011 埼玉県越谷市増林2-33</td>
              </tr>
            </table>
          </div>
          
          <!-- 重要事項 -->
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #dc2626; margin: 0 0 15px; font-size: 16px;">⚠️ 重要事項（必ずお読みください）</h3>
            <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; line-height: 1.8;">
              <li><strong>スパルタンビーチ形式</strong>：約3時間30分、休憩なしでビーチボールを行います</li>
              <li><strong>初心者は歓迎しません</strong>：経験者のみ参加可能です</li>
              <li><strong>フリー限定</strong>：フリーでプレーできる方のみ参加可能です</li>
              <li>体力に自信のある方のみご参加ください</li>
              <li>十分な水分補給の準備をお願いします</li>
            </ul>
          </div>
          
          <!-- 持ち物 -->
          <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #0369a1; margin: 0 0 15px; font-size: 16px;">🎒 持ち物</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
              <li>運動できる服装</li>
              <li>体育館シューズ</li>
              <li>タオル</li>
              <li>飲み物（多めに）</li>
              <li>着替え</li>
            </ul>
          </div>
          
          <!-- タイムスケジュール -->
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #059669; margin: 0 0 15px; font-size: 16px;">⏰ タイムスケジュール</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #ecfdf5;">
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>12:45</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">集合（時間厳守）</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>13:00</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">開会式</td>
              </tr>
              <tr style="background: #ecfdf5;">
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>13:15</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">ビーチボール開始</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>16:30</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">終了・コート片付け</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>16:45</strong></td>
                <td style="padding: 10px;">閉会式・表彰</td>
              </tr>
            </table>
          </div>
          
          <!-- 注意事項 -->
          <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #d97706; margin: 0 0 10px; font-size: 16px;">📌 その他注意事項</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
              <li>キャンセル・返金は一切お受けできません</li>
              <li>天候等による中止の場合も返金はございません</li>
              <li>怪我等は自己責任となります（スポーツ保険加入済み）</li>
              <li>駐車場には限りがあります。公共交通機関のご利用をお勧めします</li>
            </ul>
          </div>
          
          <!-- お問い合わせ -->
          <div style="text-align: center; padding: 30px 0; border-top: 1px solid #e5e7eb; margin-top: 40px;">
            <p style="color: #6b7280; margin-bottom: 10px;">ご不明な点がございましたら、お気軽にお問い合わせください。</p>
            <p style="margin: 5px 0;">
              <a href="mailto:sales@landbridge.co.jp" style="color: #059669; text-decoration: none;">sales@landbridge.co.jp</a>
            </p>
          </div>
          
          <div style="text-align: center; padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 14px;">
              当日お会いできることを楽しみにしております！<br>
              LANDBRIDGE CUP 2025 運営事務局
            </p>
          </div>
        </div>
        
        <!-- フッター -->
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;">© 2025 LandBridge株式会社</p>
          <p style="margin: 5px 0;">
            <a href="https://www.landbridge.co.jp" style="color: #059669; text-decoration: none;">www.landbridge.co.jp</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
  
  try {
    const result = await resend.emails.send({
      from: 'LANDBRIDGE CUP 2025 <noreply@landbridge.co.jp>',
      to: data.email,
      subject: '【LANDBRIDGE CUP 2025】エントリー完了のお知らせ',
      html: htmlContent,
    })
    
    return { success: true, data: result }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error }
  }
}