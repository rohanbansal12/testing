from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time
from bs4 import BeautifulSoup
from datetime import datetime
import boto3
import pandas as pd
from decimal import Decimal
import json
from util.selenium_util import generate_driver_settings
from util.misc_util import clean_type_entries
from util.aws_util import update_type_table

# get chrome_options and capabilites for selenium
chrome_options, capabilites = generate_driver_settings("xx")
driver = webdriver.Chrome("chromedriver.exe", options=chrome_options, desired_capabilities=capabilites,)

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("crystal_type_table")

response = table.scan()
data = response["Items"]

while "LastEvaluatedKey" in response:
    response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
    data.extend(response["Items"])

crystal_types = clean_type_entries(data)

for _ in range(3):
    for idx, entry in enumerate(crystal_types):
        if _ > 0:
            if entry["last_sale"]:
                continue
        driver.get(entry["last_sale_url"])
        time.sleep(1)
        content = driver.page_source
        soup = BeautifulSoup(content, features="lxml")
        i = 0
        current_last_sale = {}
        while True:
            if not soup.find_all("article"):
                print(entry["crystal_type"])
                current_last_sale = None
                break
            try:
                entry_link = "https://opensea.io" + soup.find_all("article")[i].find("a")["href"]
            except KeyError as e:
                print(entry["crystal_type"])
                current_last_sale = None
                break
            driver.get(entry_link)
            time.sleep(0.5)
            content = driver.page_source
            soup = BeautifulSoup(content, features="lxml")
            weight = int(soup.find_all("div", class_="NumericTrait--value")[0].text.split(" ")[0].replace(",", ""))
            current_last_sale["weight"] = weight
            potential_sale = soup.findAll("i", {"value": "shopping_cart"})
            if not potential_sale:
                current_last_sale = {}
                i += 1
                continue
            row = potential_sale[0].parent.parent
            price = Decimal(row.find("div", class_="Price--amount").text)
            current_last_sale["price"] = price
            all_entries = row.find_all("div", class_="Row--cell")
            etherscan_link = all_entries[-1].find("a")["href"]
            driver.get(etherscan_link)
            ethersoup = BeautifulSoup(driver.page_source, features="lxml")
            raw_date = ethersoup.find("span", {"id": "clock"}).parent.text.split("(")[1].split(" +")[0]
            timestamp = datetime.strftime(datetime.strptime(raw_date, "%b-%d-%Y %I:%M:%S %p"), "%Y-%m-%dT%H:%M:%S")
            current_last_sale["timestamp"] = timestamp
            crystal_types[idx]["last_sale"] = current_last_sale
            update_response = update_type_table(table, entry["crystal_type"], current_last_sale)
            break
