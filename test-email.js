// テスト用メール送信スクリプト
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  const { sendConfirmationEmail } = require('./lib/email.ts');
  
  const testData = {
    name: 'テスト太郎',
    email: 'mimori@landbridge.co.jp', // テスト送信先
    gender: 'male'
  };
  
  console.log('メール送信テスト開始...');
  console.log('送信先:', testData.email);
  
  const result = await sendConfirmationEmail(testData);
  
  if (result.success) {
    console.log('✅ メール送信成功！');
    console.log('Result:', result.data);
  } else {
    console.log('❌ メール送信失敗');
    console.log('Error:', result.error);
  }
}

testEmail().catch(console.error);