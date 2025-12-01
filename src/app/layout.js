import AuthSessionProvider from "@/components/AuthSessionProvider";
export default function RootLayout({ children }) {
  

  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
    </body>
    </html>
  );
}
