import './globals.css'

export const metadata = {
  title: '차원이 다른 알고케어 뉴트리션',
  description: '작지만 꽉 찬 5.1mm 초소형 영양제',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
