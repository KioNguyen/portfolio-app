#! /usr/bin/env node

import { program } from "commander";
import { Transaction, TokenBalance } from "./types";
import csvParser from "csv-parser";
import fs from "fs";
import { getPrice } from "./api";
import moment from "moment";

const checkOptionDate = (date: number) => {
  let currDate = moment.unix(date).format("YYYY-MM-DD");
  let isSameDate = moment(currDate).diff(options.date, "days") === 0;
  return isSameDate;
};

//Get command options
program
  .version("0.0.1")
  .option("-t, --token <token>", "Token symbol")
  .option("-d, --date <date>", "Date in the format YYYY-MM-DD")
  .parse(process.argv);
const options = program.opts();

// MAIN APPLICATION LOGIC
let tokens: { [key: string]: number } = {};

fs.createReadStream("transactions.csv")
  .pipe(csvParser())
  .on("data", (data: Transaction) => {
    if (options.date && !checkOptionDate(data.timestamp)) return;
    if (data.transaction_type == "DEPOSIT") {
      if (!tokens[data.token]) tokens[data.token] = 0;
      tokens[data.token] += Number(data.amount);
    } else {
      if (tokens[data.token]) tokens[data.token] -= Number(data.amount);
      else tokens[data.token] = 0;
    }
  })
  .on("end", () => {
    tokens = options.token
      ? { [options.token]: tokens[options.token] }
      : tokens;
    Promise.all(
      Object.keys(tokens).map(async (token) => {
        const tokenBalance: TokenBalance = {
          token,
          amount: tokens[token],
          price: 0,
          totalPrice: 0,
        };
        try {
          const { data } = await getPrice(token);
          data && data.USD && (tokenBalance.price = data.USD);
          tokenBalance.totalPrice = tokenBalance.price * tokenBalance.amount;
        } catch (error) {
          console.error(error);
        }
        return tokenBalance;
      })
    ).then((result) => {
      console.table(result);
    });
  });

// END MAIN APPLICATION LOGIC
