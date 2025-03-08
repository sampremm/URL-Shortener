import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Sign-up';
import URLShortener from './pages/Urlshotner';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/shorten" component={URLShortener} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/" exact>
          <h1>Welcome to the Link Shortener</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
