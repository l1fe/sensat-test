import Dashboard from './components/Dashboard';
import { AppContainer, GlobalStyle } from './styles';

function App() {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Dashboard />
      </AppContainer>
    </>
  );
}

export default App;
