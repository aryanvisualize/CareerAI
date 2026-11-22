import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";
import { ThemeProvider } from './theme.context.jsx'

function App() {
  return (
    <ThemeProvider>
      <InterviewProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </InterviewProvider>
    </ThemeProvider>
  )
}

export default App
