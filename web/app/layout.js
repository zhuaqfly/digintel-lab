import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: '数智咨询实验室 · DigIntel Lab',
  description: '数智化转型咨询 AI 平台：大模型对话、Agent/Skill 管理与咨询交付',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
