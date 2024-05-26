import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Csv.css'; // Add your CSS styling

const Csv = () => {
  const [csvData, setCsvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [subscriptionPrice, setSubscriptionPrice] = useState(0);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          setCsvData(result.data);
          console.log('Parsed CSV data:', result.data);
        },
      });
    }
  };

  // Calculate subscription price
  const basePrice = 100; // Set your base price
  const pricePerCreditLine = 10; // Set your price per credit line
  const pricePerCreditScorePoint = 5; // Set your price per credit score point

  useEffect(() => {
    if (csvData.length > 0) {
      let totalCreditScore = 0;
      let totalCreditLines = 0;

      csvData.forEach((row) => {
        totalCreditScore += row.creditScore || 0;
        totalCreditLines += row.creditLines || 0;
      });

      const newSubscriptionPrice =
        basePrice +
        pricePerCreditLine * totalCreditLines +
        pricePerCreditScorePoint * totalCreditScore;

      setSubscriptionPrice(newSubscriptionPrice);
    }
  }, [csvData]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = csvData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <div>
        {currentItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(currentItems[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((key) => (
                    <td key={key}>{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available. Please upload a CSV file.</p>
        )}
        {csvData.length > itemsPerPage && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={csvData.length}
            paginate={paginate}
          />
        )}
        <div>
          <p>Subscription Price: <strong>${subscriptionPrice.toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Csv;