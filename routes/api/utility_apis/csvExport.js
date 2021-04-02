
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { dialog } = require('electron')
const path = require('path');

module.exports = (api) => {
  /**
   * Takes in formatted transactions, and saves the 
   * transaction csv to a folder chosen by the user
   * @param {Object[]} transactions Array of {type, amount, fee, date, address, confirmations, affected_balance, txid, coin}
   */
  api.saveTransactionCsv = async (transactions) => {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })

    if (res.canceled) {
      return 
    } else {
      const csvPath = path.join(res.filePaths[0], `tx_export_${new Date().getTime()}.csv`);

      try {
        const csvWriter = createCsvWriter({
          path: csvPath,
          header: [
              {id: 'type', title: 'Type'},
              {id: 'amount', title: 'Amount'},
              {id: 'fee', title: 'Fee'},
              {id: 'date', title: 'Date'},
              {id: 'address', title: 'Address'},
              {id: 'confirmations', title: 'Confirmations'},
              {id: 'affected_balance', title: 'Balance'},
              {id: 'txid', title: 'TxID'},
              {id: 'coin', title: 'Coin'}
          ]
        });
    
        await csvWriter.writeRecords(transactions)

        dialog.showMessageBox({
          title: "Success!",
          message: "CSV file saved to " + csvPath,
          buttons: ["OK"],
        })
      } catch (e) {
        dialog.showMessageBox({
          type: "error",
          title: "Error",
          message: "Error saving CSV file to " + csvPath,
          buttons: ["OK"],
        })

        throw e
      }
    }
  }

  api.setPost('/export_transaction_csv', async (req, res, next) => {
    const { transactions } = req.body
   
    try {
      const retObj = {
        msg: 'success',
        result: await api.saveTransactionCsv(transactions),
      };

      res.send(JSON.stringify(retObj));
    } catch (e) {
      const retObj = {
        msg: 'error',
        result: e.message,
      };

      res.send(JSON.stringify(retObj));
    }
  });

  return api;
};