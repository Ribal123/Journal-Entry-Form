import React, { useState } from 'react';
import './App.css';
import abc from './assets/background.mp4';

function App() {
  const [rows, setRows] = useState([{ search: '', dr: '', cr: '', invalid: false }]);
  const [department, setDepartment] = useState('a');
  const [party, setParty] = useState('');
  const [type, setType] = useState('1');
  const [showCard, setShowCard] = useState(false);
  const [openSuggestionIdx, setOpenSuggestionIdx] = useState(null);

  const searchOptions = ['A12345', 'A67890', 'AB1234', 'AB6789', 'ABC123', 'ABC678'];

  const handleChange = (idx, field, value) => {
    const updatedRows = rows.map((row, i) => {
      if (i === idx) {
        const updated = { ...row, [field]: value };
        if (field === 'search') {
          const isValid = searchOptions.some(opt => opt.toLowerCase() === value.toLowerCase());
          updated.invalid = value && !isValid;
        }
        if (field === 'dr' && value !== '') {
          updated.cr = '0';
        }
        if (field === 'cr' && value !== '') {
          updated.dr = '0';
        }
        return updated;
      }
      return row;
    });
    setRows(updatedRows);
    if (field === 'search') setOpenSuggestionIdx(idx);

    if (
      idx === rows.length - 1 &&
      updatedRows[idx].search.trim() !== '' &&
      updatedRows[idx].dr.trim() !== '' &&
      updatedRows[idx].cr.trim() !== ''
    ) {
      setRows([...updatedRows, { search: '', dr: '', cr: '', invalid: false }]);
    }
  };

  const totalDr = rows.reduce((sum, row) => sum + (parseFloat(row.dr) || 0), 0);
  const totalCr = rows.reduce((sum, row) => sum + (parseFloat(row.cr) || 0), 0);

  return (
    <div className="app-background">
      <video autoPlay muted loop className="bg-video">
        <source src={abc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="app-container">
        <div className="glass-box">
          <h1 className="app-title">Journal Entry Form</h1>

          <div className="form-section compact-padding">
            <div className="top-section">
              <div className="input-group">
                <label>Department</label>
                <select value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="a">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                  <option value="d">D</option>
                  <option value="e">E</option>
                </select>
              </div>

              <div className="input-group">
                <label>Party</label>
                <input
                  type="text"
                  value={party}
                  onChange={e => setParty(e.target.value)}
                  placeholder="Enter party name"
                />
              </div>

              <div className="input-group">
                <label>Type</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Account Name</th>
                  <th>DR</th>
                  <th>CR</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const filtered = searchOptions.filter(opt =>
                    row.search && opt.toLowerCase().includes(row.search.toLowerCase())
                  );
                  return (
                    <tr key={idx}>
                      <td className="input-cell">
                        <input
                          type="text"
                          className="search-input"
                          value={row.search}
                          onChange={e => handleChange(idx, 'search', e.target.value)}
                          onFocus={() => setOpenSuggestionIdx(idx)}
                          placeholder="Account Name..."
                        />
                        {filtered.length > 0 && openSuggestionIdx === idx && (
                          <ul className="suggestion-list">
                            {filtered.map(opt => (
                              <li
                                key={opt}
                                onClick={() => {
                                  handleChange(idx, 'search', opt);
                                  setOpenSuggestionIdx(null);
                                }}
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                        )}
                        {row.invalid && <div className="invalid-msg">Invalid</div>}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="search-input dr-input"
                          value={row.dr}
                          onChange={e => handleChange(idx, 'dr', e.target.value)}
                          placeholder="DR"
                          disabled={parseFloat(row.cr) > 0}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="search-input cr-input"
                          value={row.cr}
                          onChange={e => handleChange(idx, 'cr', e.target.value)}
                          placeholder="CR"
                          disabled={parseFloat(row.dr) > 0}
                        />
                      </td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td>Total</td>
                  <td>{totalDr}</td>
                  <td>{totalCr}</td>
                </tr>
              </tbody>
            </table>

            <div className="button-row">
              <button onClick={() => setRows([{ search: '', dr: '', cr: '', invalid: false }])} className="reset-btn">Reset</button>
              <button
                onClick={() => {
                  if (totalDr === totalCr && totalDr !== 0) {
                    setShowCard(true);
                  } else {
                    alert('DR and CR totals must be equal to post.');
                    setShowCard(false);
                  }
                }}
                className="post-btn"
              >
                Post
              </button>
            </div>
          </div>

          {showCard && (
            <div className="summary-card-box">
              <div className="summary-card">
                <h2>Summary</h2>
                <p><strong>Department:</strong> {department}</p>
                <p><strong>Party:</strong> {party}</p>
                <p><strong>Type:</strong> {type}</p>
                <hr />
                <p><strong>Total DR:</strong> {totalDr}</p>
                <p><strong>Total CR:</strong> {totalCr}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
