import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import UsersTablePage from './components/Page'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <UsersTablePage></UsersTablePage>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  )
}

export default App
