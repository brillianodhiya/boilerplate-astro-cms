import { AppProviders } from '../providers/AppProviders';
import Login from './Login';
import { BrowserRouter } from '@lib/router';

export default function LoginApp() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AppProviders>
  );
}
