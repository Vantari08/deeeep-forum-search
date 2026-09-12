export const metadata = {
  title: "deeeep.io Forum Search",
  description: "Search the deeeep.io English forum",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
