import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { SurveyPage } from './pages/SurveyPage';
import { SummaryPage } from './pages/SummaryPage';
import { DonePage } from './pages/DonePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/survey/:sectionId" element={<SurveyPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/done" element={<DonePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
