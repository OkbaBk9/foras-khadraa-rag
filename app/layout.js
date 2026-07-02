import "./globals.css";

export const metadata = {
  title: "فرص خضراء - مساعد البحث عن الفرص",
  description: "مساعد ذكي يساعدك في إيجاد الفرص والمنح الدراسية المناسبة لك على منصة فرص خضراء",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
