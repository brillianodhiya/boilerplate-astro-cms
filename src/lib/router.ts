/**
 * Helper re-export untuk react-router-dom.
 * Menggunakan namespace import agar kompatibel dengan ESM/CJS.
 */
import * as ReactRouterDom from 'react-router-dom';

export {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

export default ReactRouterDom;
