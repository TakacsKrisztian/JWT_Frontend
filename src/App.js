import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function App() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
      fetchProducts(tokenFromStorage);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('https://jwt.sulla.hu/login', { username, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      fetchProducts(token);
    } catch (error) {
      setError("Sikertelen bejelentkezés, helytelen a felhasználónév, vagy a jelszó!");
    }
  };

  const logout = () => {
    setToken(null);
    setProducts([]);
    localStorage.removeItem('token');
  };

  const fetchProducts = async (token) => {
    try {
      const response = await axios.get('https://jwt.sulla.hu/termekek', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Sikertelen fetch:', error);
      setProducts([]);
    }
  };

  return (
    <div>
      {token ? (
        <div>
          <h2>Üdvözöljük!</h2>
          <button onClick={logout}>Kijelentkezés</button>
          <div>
            <h3>Termékek:</h3>
            <div className="product-container">
              {products.map(product => (
                <div className="product-card" key={product.id}>
                  <h4>{product.name}</h4>
                  <p>Ár: {product.price} Ft</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>Bejelentkezés</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const { username, password } = e.target.elements;
            login(username.value, password.value);
          }}>
            <input type="text" name="username" placeholder="Felhasználónév" />
            <input type="password" name="password" placeholder="Jelszó" />
            <button type="submit">Bejelentkezés</button>
            {error && <p>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default App;