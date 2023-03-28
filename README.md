## PROPINE Assessment

# Run code

- Clone source repository
- Run `npm install` to install the dependencies
- Run `npm run start  ` for no parameters
- Run `npm run start -t <token:string> ` for a token
- Run `npm run start -d <date: Date(YYYY-MM-DD)> ` for a date
- Run `npm run start -t <token> -d <date> ` for a token and a date

## Definitions

INPUT: 
 - CSV file containing all transactions 
 - Token (-t/--token) to filter transactions matching the token
 - Date (-d/--date) to filter transactions matching the date

OUTPUT:
- The portfolio value corresponding to input (table in USD)

# Technical

- Nodejs/Typescript
- CSV-parser  to get all transactions from CSV file
- Commander to create a CLI and catch all options from command line
- Moment to check transaction which is matched by date options
- Axios to fetch data from [cryptocompare](https://min-api.cryptocompare.com/) (I signed up before with token in .env file )
- Promise.all to execute all requests
