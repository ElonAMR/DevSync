import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* כשהלקוח נכנס לכתובת הראשית הרגילה - הראה לו את מסך הבית */}
        <Route path="/" element={<Home />} />

        {/* כשהלקוח נכנס לכתובת עם המילה רום וקוד - הראה לו את מסך העורך */}
        {/* המילה :roomId היא משתנה דינמי שנוכל לקרוא בהמשך */}
        <Route path="/room/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;