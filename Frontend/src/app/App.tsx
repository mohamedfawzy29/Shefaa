import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import AppRouter from "./router";

function App() {
    return (
        <ThemeProvider>
            <QueryProvider>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}

export default App;