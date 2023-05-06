import "./App.scss";
import "bootstrap/dist/css/bootstrap.css";
import Chessboard from "./components/Chessboard/Chessboard";

const App = () => {
  return (
    <div style={{placeContent: 'center', overflowY: 'hidden', height: '100vh', backgroundColor: 'rgba(26, 9, 19, 1)', paddingTop: '6rem'}}>
      <Chessboard />
    </div>
  );
};

export default App;
