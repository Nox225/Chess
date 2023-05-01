import "./App.scss";
import "bootstrap/dist/css/bootstrap.css";
import Chessboard from "./components/Chessboard/Chessboard";

const App = () => {
  return (
    <div style={{display: 'flex', placeContent: 'center', overflowY: 'hidden', marginTop: '4vh'}}>
      <Chessboard />
    </div>
  );
};

export default App;
