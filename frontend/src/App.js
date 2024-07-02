import { Routes , Route } from 'react-router-dom';
import './App.css';
import Layout from './Layout.js';
import IndexPage from './pages/IndexPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import { AuthProvider } from './UserContext.js';
import CreatePost from './pages/CreatePost.js';
import PostPage from './pages/PostPage.js';
import EditPost from './pages/EditPost.js';

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path='/' element={<Layout/>}> 
      <Route index element={<IndexPage/>}/>
      <Route path={'/login'} element={<LoginPage/>}/>
      <Route path={'/register'} element={<RegisterPage/>}/> 
      <Route path={'/create'} element={<CreatePost/>} />
      <Route path={'/post/:id'} element={<PostPage/>}/>
      <Route path={'/edit/:id'} element={<EditPost/>}/>
      </Route>
    </Routes>
    </AuthProvider>
  );
}

export default App;
