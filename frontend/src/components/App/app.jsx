import RootRouter from 'routes/Root';
import ContextProviders from './components/ContextProviders';
import GlobalStyles from './components/GlobalStyles';

export default function App() {
  return (
    <ContextProviders>
      <RootRouter />
      <GlobalStyles />
    </ContextProviders>
  );
}
