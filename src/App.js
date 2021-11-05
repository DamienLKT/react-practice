import logo from './logo.svg';
import './App.css';

function App() {
  // const name="Damien";
  const handleNameChange = () => {
    const names = ['Bob','Dave','Kevin','Damien'];
    const int = Math.floor(Math.random()*4);
    return names[int];
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />        
        <p>
          Hello {handleNameChange()}!
        </p>
      </header>
    </div>
  );
}

export default App;
